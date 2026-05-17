export type SfxKind = 'whoosh' | 'click' | 'tick' | 'impact' | 'glow' | 'pop'

export class SfxEngine {
  private ctx: AudioContext
  private dest: MediaStreamAudioDestinationNode
  private master: GainNode

  constructor() {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    this.ctx = new Ctx()
    this.dest = this.ctx.createMediaStreamDestination()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.6
    this.master.connect(this.dest)
    this.master.connect(this.ctx.destination)
  }

  get audioTrack(): MediaStreamTrack {
    return this.dest.stream.getAudioTracks()[0]
  }

  get currentTime() {
    return this.ctx.currentTime
  }

  async resume() {
    if (this.ctx.state === 'suspended') await this.ctx.resume()
  }

  async close() {
    try { await this.ctx.close() } catch {}
  }

  private envelope(node: AudioNode, t0: number, attack: number, decay: number, sustain: number, sustainDb: number, release: number, peakGain: number) {
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(peakGain, t0 + attack)
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain * Math.pow(10, sustainDb / 20)), t0 + attack + decay)
    g.gain.setValueAtTime(Math.max(0.0001, peakGain * Math.pow(10, sustainDb / 20)), t0 + attack + decay + sustain)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay + sustain + release)
    node.connect(g)
    g.connect(this.master)
    return g
  }

  play(kind: SfxKind, when: number = 0) {
    const t0 = this.currentTime + when

    if (kind === 'whoosh') {
      const noise = this.makeNoise(0.45)
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.Q.value = 1.4
      filter.frequency.setValueAtTime(220, t0)
      filter.frequency.exponentialRampToValueAtTime(3200, t0 + 0.35)
      noise.connect(filter)
      this.envelope(filter, t0, 0.04, 0.12, 0.05, -6, 0.18, 0.6)
      noise.start(t0)
      noise.stop(t0 + 0.5)
    }

    else if (kind === 'click') {
      const osc = this.ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.setValueAtTime(1600, t0)
      osc.frequency.exponentialRampToValueAtTime(800, t0 + 0.04)
      this.envelope(osc, t0, 0.002, 0.02, 0.0, -40, 0.04, 0.4)
      osc.start(t0)
      osc.stop(t0 + 0.08)
    }

    else if (kind === 'tick') {
      const osc = this.ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(3200 + Math.random() * 600, t0)
      this.envelope(osc, t0, 0.001, 0.012, 0.0, -50, 0.02, 0.18)
      osc.start(t0)
      osc.stop(t0 + 0.04)
    }

    else if (kind === 'impact') {
      const noise = this.makeNoise(0.3)
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(420, t0)
      filter.Q.value = 1.1
      noise.connect(filter)
      this.envelope(filter, t0, 0.005, 0.05, 0.02, -8, 0.25, 0.9)
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(70, t0)
      osc.frequency.exponentialRampToValueAtTime(38, t0 + 0.2)
      this.envelope(osc, t0, 0.003, 0.03, 0.05, -6, 0.25, 0.8)
      noise.start(t0); noise.stop(t0 + 0.35)
      osc.start(t0); osc.stop(t0 + 0.35)
    }

    else if (kind === 'glow') {
      const osc1 = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      osc1.type = 'sine'; osc2.type = 'sine'
      osc1.frequency.setValueAtTime(880, t0)
      osc2.frequency.setValueAtTime(1320, t0)
      this.envelope(osc1, t0, 0.18, 0.2, 0.4, -3, 0.4, 0.18)
      this.envelope(osc2, t0, 0.22, 0.2, 0.4, -6, 0.4, 0.12)
      osc1.start(t0); osc1.stop(t0 + 1.2)
      osc2.start(t0); osc2.stop(t0 + 1.2)
    }

    else if (kind === 'pop') {
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(420, t0)
      osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.12)
      this.envelope(osc, t0, 0.003, 0.04, 0.02, -10, 0.12, 0.5)
      osc.start(t0)
      osc.stop(t0 + 0.2)
    }
  }

  private makeNoise(durationSec: number): AudioBufferSourceNode {
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * durationSec), this.ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.9
    const src = this.ctx.createBufferSource()
    src.buffer = buf
    return src
  }
}
