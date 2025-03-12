let poly;

let bg;

function preload() {
  bg = loadImage("paper.jpeg");
}

function setup() {
  createCanvas(600, 600);
  
  const v = [];
  const n = 4;
  for(let i = 0; i < n; i ++) {
    let a = i * (TAU/n);
    v.push(createVector(width/2 + cos(a) * 200, height/2 + sin(a) * 200));
  }
  
  poly = new Poly(v);
  
  noLoop();
}

function draw() {
  background(255);
  tint(255, 150);
  image(bg, 0, 0, width, height);
  //poly.draw();
  waterColour(poly, color(255, 100, 0));
}

class Poly {
  constructor(vertices, modifiers) {
    this.vertices = vertices;
    if(!modifiers) {
      modifiers = [];
      for(let i = 0; i < vertices.length; i ++) {
        modifiers.push(random(0.1, 0.8));
      }
    }
    this.modifiers = modifiers;
  }
  
  grow() {
    const grownVerts = [];
    const grownMods = [];
    for(let i = 0; i < this.vertices.length; i ++) {
      const j = (i + 1) % this.vertices.length;
      const v1 = this.vertices[i];
      const v2 = this.vertices[j];
      
      const mod = this.modifiers[i];
      
      const chmod = m => {
        return m + (rand() - 0.5) * 0.1;
      }
      
      grownVerts.push(v1);
      grownMods.push(chmod(mod));
      
      const segment = p5.Vector.sub(v2, v1);
      const len = segment.mag();
      segment.mult(rand());
      
      const v = p5.Vector.add(segment, v1);
      
      segment.rotate(-PI/2 + (rand()-0.5) * PI/4);
      segment.setMag(rand() * len/2 * mod);
      v.add(segment);
      
      grownVerts.push(v);
      grownMods.push(chmod(mod));
    }
    return new Poly(grownVerts, grownMods);
  }
  
  dup() {
    return new Poly(Array.from(this.vertices), Array.from(this.modifiers));
  }
  
  draw() {
    beginShape();
    for(let v of this.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}

function waterColour(poly, colour) {
  const numLayers = 50;
  fill(red(colour), green(colour), blue(colour), 255/(2 * numLayers));
  noStroke();
  
  poly = poly.grow().grow();
  
  for(let i = 0; i < numLayers; i ++) {
    if(i == int(numLayers/3) || i == int(2 * numLayers/3)) {
      poly = poly.grow().grow();
    }
    
    poly.grow().draw();
  }  
}

function rand() {
  return distribute(random(1));
}

function distribute(x) {
  return pow((x - 0.5) * 1.58740105, 3) + 0.5;
}




