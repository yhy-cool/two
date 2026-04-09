
const svgRequire = import.meta.glob('./svg/*.svg', { eager: true })

console.log(Object.keys(svgRequire))

