// @ts-nocheck

import dynamic from 'next/dynamic'
import React from 'react'
// Disable SSR for components that rely on browser APIs like window.
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function PerlinNoiseCanvas() {
  let inc
  let scl
  let cols
  let rows

  let zoff

  // let fr

  const particles = []

  const flowField = []

  //   function windowResized() {
  //     p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
  //     console.log('Resized canvas event')
  //   }

  function setup(p5, canvasParentRef) {
    // const parentDivWidth = document.querySelector('#PerlinNoiseCanvasParent').scrollWidth
    p5.createCanvas(430, 250).parent(canvasParentRef) // Assign parent div (https://p5js.org/reference/#/p5.Element/parent)
    // p5 js canvas as a background https://stackoverflow.com/questions/46874608/how-to-put-p5-canvas-into-our-div-background
    // p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef)

    zoff = 0
    scl = 3 // Regulates how linear the patterns are. Higher means less but sharper turns.
    inc = 50 // Regulates how many major patterns there are. Higher means more patterns.
    cols = Math.floor(p5.width / scl)
    rows = Math.floor(p5.height / scl)
    // fr = p5.createP() // Creates a <p></p> element in the DOM with given inner HTML. Used for paragraph length text.

    // Presets

    // Starts from one corner, small lines with lots of diversion
    // scl = 1
    // inc = 150

    // scl = 3
    // inc = 50

    // Particle function is here because you can't use p5.js functions outside of setup() and draw()
    // https://stackoverflow.com/questions/38990679/using-p5s-functions-without-the-setup-draw-format
    function Particle() {
      this.pos = p5.createVector(Math.random(), Math.random())
      this.vel = p5.createVector(0, 0)
      this.acc = p5.createVector(0, 0)
      this.maxspeed = 1.25
      this.prevPos = this.pos.copy()
      this.follow = function (vectors) {
        const x = Math.floor(this.pos.x / scl)
        const y = Math.floor(this.pos.y / scl)
        const index = x + y * cols
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
        p5.stroke(99, 143, 255, 5)
        // p5.stroke(0, 3)
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

    for (let i = 0; i < 100; i++) {
      particles[i] = new Particle()
    }

    // sets the color used for the background of the p5.js canvas. The default background is transparent.
    // p5.background(220)
  }

  let drawIterationCount = 0

  function draw(p5) {
    if (drawIterationCount > 2500) {
      return
    }
    console.log(drawIterationCount)
    drawIterationCount++
    let yoff = 0
    for (let y = 0; y < rows; y++) {
      let xoff = 0
      for (let x = 0; x < cols; x++) {
        const index = x + y * cols
        const angle = p5.noise(xoff, yoff, zoff) * p5.TWO_PI
        const v = p5.constructor.Vector.fromAngle(angle) // The need to use 'constructor': https://stackoverflow.com/questions/66540987/p5-vector-subraction-sub-returning-error
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
    // fr.html(Math.floor(p5.frameRate()) + ' fps')
  }

  return <Sketch setup={setup} draw={draw} />
}

// Working example of p5.js within NextJS #1

// // // Used to disable SSR for components that rely on browser APIs like window.
// import dynamic from 'next/dynamic'
// // // const Sketch = dynamic(import('react-p5'), { ssr: false })
// // const p5 = dynamic(import('p5'), { ssr: false })

// import React from 'react'
// // import Sketch from 'react-p5'
// const Sketch = dynamic(import('react-p5'), { ssr: false })

// let x = 50
// const y = 50
// export default function PerlinNoiseCanvas(props) {
//   const setup = (p5, canvasParentRef) => {
//     // use parent to render the canvas in this ref
//     // (without that p5 will render the canvas outside of your component)
//     p5.createCanvas(500, 500).parent(canvasParentRef)
//   }

//   const draw = (p5) => {
//     p5.background(0)
//     p5.ellipse(x, y, 70, 70)
//     // NOTE: Do not use setState in the draw function or in functions that are executed
//     // in the draw function...
//     // please use normal variables or class properties for these purposes
//     x++
//   }

//   return <Sketch setup={setup} draw={draw} />
// }

// Working example of p5.js within NextJS #2
// function draw(p5) {
// p5.background(200)

// // Create a variable, proportional to the mouseX,
// // varying from 0-360, to represent an angle in degrees.
// const myDegrees = p5.map(p5.mouseX, 0, p5.width, 0, 360)

// // Display that variable in an onscreen text.
// // (Note the nfc() function to truncate additional decimal places,
// // and the "\xB0" character for the degree symbol.)
// const readout = 'angle = ' + p5.nfc(myDegrees, 1) + '\xB0'
// p5.noStroke()
// p5.fill(0)
// p5.text(readout, 5, 15)

// // Create a p5.Vector using the fromAngle function,
// // and extract its x and y components.
// const v = p5.constructor.Vector
// console.log(v)
// const vx = v.x
// const vy = v.y

// p5.push()
// p5.translate(p5.width / 2, p5.height / 2)
// p5.noFill()
// p5.stroke(150)
// p5.line(0, 0, 30, 0)
// p5.stroke(0)
// p5.line(0, 0, vx, vy)
// p5.pop()
// }
