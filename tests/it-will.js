const originalIt = window.it;

// This turns every call of `it` into a "convergent assertion." The
// assertion is run every 10ms until it is either true, or it times
// out. This makes it incredibly robust in the face of asynchronous
// operations which could happen instantly, or they could happen after
// 1.5 seconds. The assertion doesn't care until it's reflected
// in the UI.
//
// The only caveat is that all assertions should be "pure" that is to
// say, completely without side-effects.
//
// good:
//  it('has some state', function() {
//    expect(thing).to.be('awesome');
//  });
//
// bad:
//   it('twiddles when clicked', function() {
//     click('.a-button');
//     expect(thing).to.be('set');
//   });
export default function itWill(...args) {
  if (args.length <= 1) {
    return originalIt(...args);
  } else {
    let [name, assertion] = args;

    return originalIt(name, function() {
      let timeout = this.timeout();
      let interval = 10;
      let start = new Date().getTime();
      let test = this;

      return new Promise(function(resolve, reject) {
        (function loop() {
          try {
            let res = assertion.call(test);
            if (res && typeof res.then === 'function') {
              res.then(resolve);
            } else {
              resolve();
            }
          } catch(e) {
            let now = new Date().getTime();
            if (now - start + interval >= timeout) {
              reject(e);
            } else {
              setTimeout(loop, interval);
            }
          }
        })();
      });
    });
  }
}
