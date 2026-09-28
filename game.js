const c = document.querySelector("#game");
const x = c.getContext("2d");

let W;
let H;

let D = devicePixelRatio || 1;

let run = false;
let last = 0;

let score = 0;
let hp = 100;
let en = 100;

let keys = {};

let p;
let cs;
let es;
let portal;

let parts = [];


function size() {

  W = innerWidth;
  H = innerHeight;

  c.width = W * D;
  c.height = H * D;

  x.setTransform(
    D,
    0,
    0,
    D,
    0,
    0
  );
}


addEventListener(
  "resize",
  size
);

size();


function rnd(a, b) {

  return a +
    Math.random() *
    (b - a);
}


function dist(a, b) {

  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );
}


function cl(v, a, b) {

  return Math.max(
    a,
    Math.min(b, v)
  );
}


function reset() {

  score = 0;
  hp = 100;
  en = 100;

  p = {

    x: W / 2,
    y: H / 2,

    r: 17,

    s: 210

  };


  cs = Array.from(
    { length: 5 },
    () => ({

      x: rnd(50, W - 50),

      y: rnd(
        90,
        H - 120
      ),

      got: false

    })
  );


  es = Array.from(
    { length: 4 },
    () => ({

      x: rnd(50, W - 50),

      y: rnd(
        100,
        H - 120
      ),

      alive: true

    })
  );


  portal = {

    x: W - 65,

    y: 95,

    r: 25

  };


  parts = [];
}


addEventListener(
  "keydown",
  e => {

    keys[e.key] = 1;

  }
);


addEventListener(
  "keyup",
  e => {

    keys[e.key] = 0;

  }
);


document
  .querySelectorAll(
    "[data-k]"
  )
  .forEach(b => {

    b.onpointerdown = () => {

      keys[
        b.dataset.k
      ] = 1;

    };


    b.onpointerup = () => {

      keys[
        b.dataset.k
      ] = 0;

    };


    b.onpointerleave = () => {

      keys[
        b.dataset.k
      ] = 0;

    };

  });


document
  .querySelector("#power")
  .onpointerdown = power;


function power() {

  if (
    !run ||
    en < 20
  ) {

    return;

  }


  en -= 20;


  es.forEach(e => {

    if (
      e.alive &&
      dist(e, p) < 125
    ) {

      e.alive = false;

      score += 50;

    }

  });


  for (
    let i = 0;
    i < 25;
    i++
  ) {

    parts.push({

      x: p.x,

      y: p.y,

      a: rnd(
        0,
        6.28
      ),

      v: rnd(
        70,
        190
      ),

      l: 0.5

    });

  }

}


function update(dt) {

  if (!run) {

    return;

  }


  let dx =
    (keys.ArrowRight ? 1 : 0) -
    (keys.ArrowLeft ? 1 : 0);


  let dy =
    (keys.ArrowDown ? 1 : 0) -
    (keys.ArrowUp ? 1 : 0);


  if (dx || dy) {

    let n =
      Math.hypot(dx, dy);


    p.x +=
      dx / n *
      p.s *
      dt;


    p.y +=
      dy / n *
      p.s *
      dt;

  }


  p.x =
    cl(
      p.x,
      22,
      W - 22
    );


  p.y =
    cl(
      p.y,
      75,
      H - 80
    );


  en =
    cl(
      en + 7 * dt,
      0,
      100
    );


  cs.forEach(o => {

    if (
      !o.got &&
      dist(o, p) < 28
    ) {

      o.got = true;

      score += 100;

    }

  });


  es.forEach(e => {

    if (!e.alive) {

      return;

    }


    let dx =
      p.x - e.x;


    let dy =
      p.y - e.y;


    let d =
      Math.hypot(
        dx,
        dy
      );


    if (d < 180) {

      e.x +=
        dx / d *
        38 *
        dt;


      e.y +=
        dy / d *
        38 *
        dt;

    }


    if (d < 28) {

      hp -=
        9 * dt;

    }

  });


  parts.forEach(q => {

    q.x +=
      Math.cos(q.a) *
      q.v *
      dt;


    q.y +=
      Math.sin(q.a) *
      q.v *
      dt;


    q.l -= dt;

  });


  parts =
    parts.filter(
      q => q.l > 0
    );


  if (
    cs.every(
      o => o.got
    ) &&
    dist(
      p,
      portal
    ) < 45
  ) {

    run = false;


    document.querySelector(
      "#msg"
    ).textContent =
      "🏆 Level Complete! Score: " +
      score;


    document.querySelector(
      "#start"
    ).textContent =
      "PLAY AGAIN";


    document.querySelector(
      "#menu"
    ).style.display =
      "grid";

  }


  if (hp <= 0) {

    run = false;


    document.querySelector(
      "#msg"
    ).textContent =
      "💥 Game Over — Score: " +
      score;


    document.querySelector(
      "#start"
    ).textContent =
      "TRY AGAIN";


    document.querySelector(
      "#menu"
    ).style.display =
      "grid";

  }


  document.querySelector(
    "#hp"
  ).textContent =
    Math.max(
      0,
      Math.round(hp)
    );


  document.querySelector(
    "#energy"
  ).textContent =
    Math.round(en);


  document.querySelector(
    "#score"
  ).textContent =
    score;

}


function draw() {

  let g =
    x.createLinearGradient(
      0,
      0,
      0,
      H
    );


  g.addColorStop(
    0,
    "#0b4b5b"
  );


  g.addColorStop(
    1,
    "#071d22"
  );


  x.fillStyle = g;

  x.fillRect(
    0,
    0,
    W,
    H
  );


  for (
    let i = 0;
    i < 55;
    i++
  ) {

    x.fillStyle =
      i % 2
        ? "#19583f"
        : "#124731";


    x.beginPath();


    x.arc(

      (i * 137) % W,

      75 +
      (i * 91) %
      (H - 130),

      18 +
      (i % 5) * 4,

      0,
      7

    );


    x.fill();

  }


  cs.forEach(o => {

    if (o.got) {

      return;

    }


    x.shadowBlur = 18;

    x.shadowColor =
      "#7df7ff";


    x.fillStyle =
      "#6eeaff";


    x.beginPath();


    x.moveTo(
      o.x,
      o.y - 12
    );


    x.lineTo(
      o.x + 9,
      o.y
    );


    x.lineTo(
      o.x,
      o.y + 12
    );


    x.lineTo(
      o.x - 9,
      o.y
    );


    x.fill();


    x.shadowBlur = 0;

  });


  x.fillStyle =
    "#55e7ff";


  x.beginPath();


  x.arc(
    portal.x,
    portal.y,
    portal.r,
    0,
    7
  );


  x.fill();


  x.fillStyle =
    "#062630";


  x.beginPath();


  x.arc(
    portal.x,
    portal.y,
    17,
    0,
    7
  );


  x.fill();


  es.forEach(e => {

    if (!e.alive) {

      return;

    }


    x.fillStyle =
      "#d34c67";


    x.beginPath();


    x.arc(
      e.x,
      e.y,
      16,
      0,
      7
    );


    x.fill();


    x.fillStyle =
      "#fff";


    x.beginPath();


    x.arc(
      e.x - 5,
      e.y - 3,
      3,
      0,
      7
    );


    x.arc(
      e.x + 5,
      e.y - 3,
      3,
      0,
      7
    );


    x.fill();

  });


  x.fillStyle =
    "#f0d38b";


  x.beginPath();


  x.arc(
    p.x,
    p.y,
    p.r,
    0,
    7
  );


  x.fill();


  x.fillStyle =
    "#37c4aa";


  x.beginPath();


  x.arc(
    p.x,
    p.y - 7,
    11,
    Math.PI,
    0
  );


  x.fill();


  parts.forEach(q => {

    x.fillStyle =
      "rgba(100,240,255," +
      (q.l * 2) +
      ")";


    x.fillRect(
      q.x,
      q.y,
      3,
      3
    );

  });

}


function loop(t) {

  let dt =
    Math.min(
      0.033,
      (t - last) / 1000 || 0
    );


  last = t;


  update(dt);

  draw();


  requestAnimationFrame(
    loop
  );

}


document
  .querySelector("#start")
  .onclick = () => {

    document.querySelector(
      "#menu"
    ).style.display =
      "none";


    reset();

    run = true;

  };


reset();


requestAnimationFrame(
  loop
);
