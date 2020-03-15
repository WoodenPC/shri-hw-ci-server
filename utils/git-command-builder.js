/**
 * билдер комманды для гита
 */
class GitCommandBuilder {
  constructor() {
    this.target = null;
    this.pretty = null;
    this.otherInfo = null;
    this.branch = null;
    this.count = null;
  }

  addTarget = (target) => {
    this.target = target;
    return this;
  }

  addPretty = (pretty) => {
    this.pretty = pretty;
    return this;
  }

  addOtherInfo = (otherInfo) => {
    this.otherInfo = otherInfo;
    return this;
  }

  addBranch = (branch) => {
    this.branch = branch;
    return this;
  }

  addCount = (count) => {
    this.count = count;
    return this;
  }

  build = () => {
    const result = [];
    if (this.target !== null) {
      result.push(this.target);
    }

    if (this.count !== null) {
      result.push(`-${this.count}`);
    }

    if (this.pretty !== null) {
      result.push(this.pretty);
    }

    if(this.otherInfo !== null) {
      result.push(this.otherInfo);
    }

    if (this.branch !== null) {
      result.push(this.branch);
    }

    return result;
  }
}

module.exports = GitCommandBuilder;