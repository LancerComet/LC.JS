function getAllProperties (object: any){
  const allProps = []
  let curr = object

  do {
    const props = Object.getOwnPropertyNames(curr)
    props.forEach(function (prop) {
      if (allProps.indexOf(prop) === -1) {
        allProps.push(prop)
      }
    })
  } while (curr = Object.getPrototypeOf(curr))

  return allProps
}

export {
  getAllProperties
}
