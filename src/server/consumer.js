var BaseConsumer = {
  name: "BaseConsumer",
  container: undefined,
  dependencyKeys: [],
  init: async function(container) {
    this.container = container;
    await this.rebind();
  },
  rebind: async function() {
    this.dependencyKeys.forEach(async (dependencyKey) => {
      this[dependencyKey] = await this.container.lookup(dependencyKey);
    });
    console.log('completed binding for ' + this.name);
  }
};
export default BaseConsumer;