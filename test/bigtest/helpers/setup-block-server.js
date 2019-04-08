export default function setupBlockServer(server) {
  server.block = function block() {
    const { pretender } = this;
    const blocks = [];
    const _handlerFor = pretender._handlerFor;
    pretender._handlerFor = (...args) => {
      return {
        handler(request) {
          return new Promise((resolve, reject) => {
            blocks.push(() => {
              try {
                resolve(_handlerFor.apply(pretender, args).handler(request));
              } catch (error) {
                reject(error);
              }
            });
          });
        }
      };
    };
    this.block = () => { throw new Error('called block() when the mirage server is already blocked'); };
    this.unblock = function unblock() {
      pretender._handlerFor = _handlerFor;
      blocks.forEach(unblocker => unblocker());
      this.block = block;
      delete this.unblock;
    };
  };
}
