import React from 'react'
// import { ReactNode } from 'react'
import p5 from 'p5'

export default function PerlinNoiseCanvas() {
  React.useEffect(() => {
    function Particle() {
      this.pos = p5.createVector(Math.random(), Math.random())
      this.vel = p5.createVector(0, 0)
      this.acc = p5.createVector(0, 0)
      this.maxspeed = 1

      this.prevPos = this.pos.copy()

      this.follow = function (vectors) {
        const x = Math.floor(this.pos.x / p5.scl)
        const y = Math.floor(this.pos.y / p5.p5.scl)
        const index = x + y * p5.cols
        const force = vectors[index]
        this.applyForce(force)
      }

      this.update = function () {
        this.vel.add(this.acc)
        this.vel.limit(this.maxspeed)
        this.pos.add(this.vel)
        this.acc.mult(0)
      }

      this.applyForce = function (force) {
        this.acc.add(force)
      }

      this.show = function () {
        p5.stroke(0, 3)
        p5.strokeWeight(1)
        p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
        //point(this.pos.x, this.pos.y);
        this.updatePrev()
      }

      this.updatePrev = function () {
        this.prevPos.x = this.pos.x
        this.prevPos.y = this.pos.y
      }
      this.edges = function () {
        if (this.pos.x > p5.width) {
          this.pos.x = 0
          this.updatePrev()
        }
        if (this.pos.x < 0) {
          this.pos.x = p5.width
          this.updatePrev()
        }
        if (this.pos.y > p5.height) {
          this.pos.y = 0
          this.updatePrev()
        }
        if (this.pos.y < 0) {
          this.pos.y = p5.height
          this.updatePrev()
        }
      }
    }

    let inc
    let scl
    let cols
    let rows

    let zoff

    let fr

    const particles = []

    const flowField = []

    function setup() {
      p5.createCanvas(600, 600)
      zoff = 0
      scl = 10
      inc = 0.1
      cols = Math.floor(p5.width / scl)
      rows = Math.floor(p5.height / scl)
      fr = p5.createP()

      for (let i = 0; i < 2000; i++) {
        particles[i] = new Particle()
      }

      p5.background(220)
    }
    setup()

    function draw() {
      let yoff = 0
      for (let y = 0; y < rows; y++) {
        let xoff = 0
        for (let x = 0; x < cols; x++) {
          const index = x + y * cols
          const angle = p5.noise(xoff, yoff, zoff) * 3.14159 * 2
          const v = p5.Vector.fromAngle(angle)
          v.setMag(1)
          flowField[index] = v
          xoff += inc
        }
        yoff += inc
        zoff += 0.0002
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].edges()
        particles[i].show()
        particles[i].follow(flowField)
      }
      fr.html(Math.floor(p5.frameRate()) + ' fps')
    }
    draw()
  }, [])

  return <div></div>
}
