// app flavors
const FLAVORS = [
    { name: 'main', path: 'main' }
]

// main function call
main()

function main() {
    generateManifests(FLAVORS)
}

function generateManifests(flavors) {
    flavors.forEach(flavor => {
        console.log(`Create manifest for flavor: ${flavor.name}`)
        // create your manifest files dynamically
    })
}
