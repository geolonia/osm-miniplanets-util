import { Command } from 'commander'
import * as fs from 'fs'
import * as child_process from 'child_process'
import * as mp from '@geolonia/osm-miniplanets'
import { exitCode } from 'process'

const getBBox = (tileIndex) => {
  const paddedTileIndex = tileIndex.toString().padStart(2, '0')
  const feature = mp.generateGeoJSON().features.find(x => x.properties.id === paddedTileIndex)
  if (!feature) {
    throw new Error(`Tile index ${tileIndex} not found`)
  }
  return feature.properties.bbox.join(',')    
}

const extractPlanet = (inputFile, tileIndex, outputDir) => {
  const bbox = getBBox(tileIndex)
  const paddedTileIndex = tileIndex.toString().padStart(2, '0')

  // Create output directory if it doesn't exist
  fs.mkdirSync(outputDir, { recursive: true })

  const osmium = child_process.spawn('osmium', [
    'extract',
    '--bbox', bbox,
    '--output', `${outputDir}/planet-${paddedTileIndex}.osm.pbf`,
    '--set-bounds',
    inputFile
  ], {
    stdio: 'inherit'
  })
  osmium.on('close', async (exitCode) => {
    if (exitCode !== 0) {
      console.error(`osmium command failed with exit code ${exitCode}`)
      process.exit(exitCode)
    } else {
      console.log(`Extracted tile index ${tileIndex} to ${outputDir}/planet-${tileIndex}.osm.pbf`)
    }
  })
}

const extractAll = (inputFile, outputDir) => {
  const features = mp.generateGeoJSON().features
  features.forEach(feature => {
    const tileIndex = feature.properties.id
    extractPlanet(inputFile, tileIndex, outputDir)
  })
}

const program = new Command()

program
  .name('index.js')
  .description('OSM planet tools')
  .version('1.0.0')

// `bbox` subcommand
program
  .command('bbox')
  .description('Generate bbox for a tile index')
  .option('-t, --tile-index <number>', 'Tile index to process', parseInt)
  .action((options) => {
    console.log(getBBox(options.tileIndex))
  })

// `extract` subcommand
program
  .command('extract')
  .description('Extract data for a tile index')
  .option('-i, --input <path>', 'Input OSM PBF file path', './planet.osm.pbf')
  .option('-t, --tile-index <number>', 'Tile index to process', parseInt)
  .option('-o, --output <path>', 'Output directory path', './storage')
  .action((options) => {
    console.log(`[extract] Tile index is: ${options.tileIndex}`)
    extractPlanet(options.input, options.tileIndex, options.output)
  })

program
  .command('extract-all')
  .description('Extract all tiles from the planet file')
  .option('-i, --input <path>', 'Input OSM PBF file path', './planet.osm.pbf')
  .option('-o, --output <path>', 'Output directory path', './storage')
  .action((options) => {
    console.log(`[extract-all] Extracting all tiles from ${options.input} to ${options.output}`)
    extractAll(options.input, options.output)
  })

program.parse(process.argv)

