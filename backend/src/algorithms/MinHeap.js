class MinHeap {
  constructor() {
    this.data = []
  }

  size() {
    return this.data.length
  }

  peek() {
    return this.data[0]
  }

  push(item) {
    this.data.push(item)
    this._bubbleUp(this.data.length - 1)
  }

  pop() {
    if (this.data.length === 0) return undefined
    const top = this.data[0]
    const last = this.data.pop()
    if (this.data.length > 0) {
      this.data[0] = last
      this._bubbleDown(0)
    }
    return top
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this._compare(this.data[index], this.data[parent]) >= 0) break
      ;[this.data[parent], this.data[index]] = [this.data[index], this.data[parent]]
      index = parent
    }
  }

  _bubbleDown(index) {
    const n = this.data.length
    while (true) {
      let smallest = index
      const l = index * 2 + 1
      const r = index * 2 + 2
      if (l < n && this._compare(this.data[l], this.data[smallest]) < 0) smallest = l
      if (r < n && this._compare(this.data[r], this.data[smallest]) < 0) smallest = r
      if (smallest === index) break
      ;[this.data[index], this.data[smallest]] = [this.data[smallest], this.data[index]]
      index = smallest
    }
  }

  _compare(a, b) {
    const sa = (a && a.score) || 0
    const sb = (b && b.score) || 0
    return sa - sb
  }
}

module.exports = MinHeap
