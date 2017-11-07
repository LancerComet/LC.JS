let tickInExec = false
let jobQueue = []

/**
 * Do something in next tick.
 *
 * @param {Function} callback
 */
function nextTick (callback: Function) {
  if (typeof callback === 'function') {
    jobQueue.push(callback)
  }

  if (!tickInExec) {
    exec()
  }
}

export {
  nextTick
}

function exec () {
  tickInExec = true
  Promise.resolve().then(() => {
    for (let i = 0, length = jobQueue.length; i < length; i++) {
      const callback = jobQueue[i]
      typeof callback === 'function' && callback()
    }
    jobQueue = []
    tickInExec = false
  }).catch(error => {
    console.error(error)
  })
}
