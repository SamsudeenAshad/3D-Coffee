const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FRAMES = 300;
const OUTPUT_DIR = path.join(__dirname, '../public/frames');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background-color: transparent; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
</body>
</html>
`;

const threeCode = `
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(1000, 1000);
    renderer.setClearColor(0x000000, 0); // transparent background
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Create Coffee Cup
    const cupGroup = new THREE.Group();

    // Cup body
    const cupGeometry = new THREE.CylinderGeometry(1.2, 0.9, 2.5, 32);
    const cupMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cupGroup.add(cup);

    // Coffee inside
    const coffeeGeometry = new THREE.CylinderGeometry(1.15, 1.15, 2.45, 32);
    const coffeeMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b2818,
      roughness: 0.4
    });
    const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
    coffee.position.y = 0.05;
    cupGroup.add(coffee);

    // Handle
    const handleGeometry = new THREE.TorusGeometry(0.7, 0.15, 16, 50);
    const handleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.x = 1.25;
    handle.position.y = 0;
    handle.rotation.z = Math.PI / 16;
    cupGroup.add(handle);
    
    // Steam
    const steamGroup = new THREE.Group();
    const steamMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
    for(let i = 0; i < 3; i++) {
        const steamGeom = new THREE.SphereGeometry(0.3 + Math.random()*0.2, 16, 16);
        const steam = new THREE.Mesh(steamGeom, steamMaterial);
        steam.position.set((Math.random() - 0.5)*1.5, 1.5 + i*0.8, (Math.random() - 0.5)*1.5);
        steamGroup.add(steam);
    }
    cupGroup.add(steamGroup);

    scene.add(cupGroup);

    window.renderFrame = function(frameIndex, totalFrames) {
      const progress = frameIndex / totalFrames;
      
      // Rotate 360 degrees
      cupGroup.rotation.y = progress * Math.PI * 2;
      
      // Gentle tilt up and down
      cupGroup.rotation.x = Math.sin(progress * Math.PI * 2) * 0.15;
      cupGroup.rotation.z = Math.cos(progress * Math.PI * 2) * 0.05;

      // Animate steam
      steamGroup.children.forEach((child, i) => {
         child.position.y += 0.02;
         child.scale.x = 1 + Math.sin(progress * Math.PI * 10 + i) * 0.2;
         if (child.position.y > 4) {
             child.position.y = 1.5;
         }
      });
      
      // Camera zoom effect
      if (progress < 0.5) {
          camera.position.z = 10 - (progress * 4);
      } else {
          camera.position.z = 6 + ((progress - 0.5) * 4);
      }

      renderer.render(scene, camera);
    };
`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1000, height: 1000, deviceScaleFactor: 1 });
  await page.setContent(html);
  
  console.log('Loading Three.js...');
  await page.addScriptTag({ path: require.resolve('three/build/three.min.js') });
  console.log('Injecting rendering code...');
  await page.addScriptTag({ content: threeCode });

  console.log('Generating frames...');
  for (let i = 1; i <= FRAMES; i++) {
    await page.evaluate(`window.renderFrame(${i}, ${FRAMES})`);
    const fileName = `frame${i.toString().padStart(3, '0')}.png`;
    await page.screenshot({ path: path.join(OUTPUT_DIR, fileName), omitBackground: true });
    if (i % 30 === 0) console.log(`Generated ${i}/${FRAMES} frames`);
  }

  console.log('Done generating all frames.');
  await browser.close();
})();
