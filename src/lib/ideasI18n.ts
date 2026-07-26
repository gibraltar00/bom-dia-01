import type { LangCode } from './translations';
import type { IdeaCategory, UpcycleIdea } from './data';

interface MaterialEntry {
  keywords: string[];
  daily: UpcycleIdea[];
  decoration: UpcycleIdea[];
  toy: UpcycleIdea[];
}

const en: MaterialEntry[] = [
  {
    keywords: ['plastic', 'bottle', 'pet'],
    daily: [
      { title: 'Plastic Bottle Plant Waterer', description: 'Turn a plastic bottle into a slow-drip plant waterer that keeps your plants hydrated for days.', category: 'daily', difficulty: 'easy', materials: ['1 plastic bottle', 'a needle or nail', 'water'], steps: ['Clean the bottle and remove the label.', 'Poke a small hole near the base.', 'Fill with water, screw the cap on, and bury near a plant.'] },
      { title: 'Bottle Toothbrush Holder', description: 'Cut the top off a bottle to make a wall-mounted toothbrush holder for the bathroom.', category: 'daily', difficulty: 'medium', materials: ['1 plastic bottle', 'scissors', 'glue or suction cup'], steps: ['Cut the top third off the bottle.', 'Smooth the cut edge with sandpaper.', 'Mount on the wall and drop in toothbrushes.'] },
      { title: 'Bottle Scoop', description: 'Cut a bottle diagonally to make a scoop for pet food, garden soil, or laundry powder.', category: 'daily', difficulty: 'easy', materials: ['1 plastic bottle', 'scissors or craft knife'], steps: ['Cut the bottle diagonally from top to bottom.', 'Keep the cap on for a handle.', 'Sand the cut edge smooth.'] },
      { title: 'Bottle Pencil Case', description: 'Zip two bottle bottoms together to make a clear pencil case.', category: 'daily', difficulty: 'medium', materials: ['2 plastic bottles', 'a zipper', 'glue'], steps: ['Cut the bottoms off both bottles.', 'Glue a zipper between the two cut edges.', 'Open and fill with pens.'] },
    ],
    decoration: [
      { title: 'Bottle Cap Mosaic Frame', description: 'Collect colorful bottle caps and glue them into a mosaic on an old photo frame.', category: 'decoration', difficulty: 'medium', materials: ['Many bottle caps', 'old photo frame', 'strong glue', 'paint (optional)'], steps: ['Sort caps by color.', 'Plan a pattern on the frame.', 'Glue each cap in place and let it dry overnight.'] },
      { title: 'Plastic Bottle Flower Lamp', description: 'Cut bottle bottoms into petal shapes and stack them into a hanging flower lamp.', category: 'decoration', difficulty: 'hard', materials: ['Several plastic bottles', 'scissors', 'LED light', 'wire'], steps: ['Cut the bottoms off bottles.', 'Shape petals and layer them.', 'Insert an LED light and hang.'] },
      { title: 'Bottle Planters', description: 'Cut bottles in half, paint them, and hang them as a vertical garden on your wall.', category: 'decoration', difficulty: 'medium', materials: ['plastic bottles', 'paint', 'twine', 'soil', 'small plants'], steps: ['Cut bottles in half and paint.', 'Thread twine through the top.', 'Add soil and plants, then hang.'] },
      { title: 'Bottle Birdhouse', description: 'Cut a hole and paint a bottle to make a weatherproof birdhouse for the garden.', category: 'decoration', difficulty: 'hard', materials: ['1 large plastic bottle', 'paint', 'string', 'a stick'], steps: ['Cut an entry hole near the top.', 'Insert a stick perch below the hole.', 'Paint, add string, and hang outside.'] },
    ],
    toy: [
      { title: 'Bottle Bowling Set', description: 'Fill bottles with a little rice and use them as bowling pins for a homemade lane.', category: 'toy', difficulty: 'easy', materials: ['6 plastic bottles', 'rice', 'a soft ball'], steps: ['Add a handful of rice to each bottle for weight.', 'Arrange them in a triangle.', 'Roll the ball and play!'] },
      { title: 'Bottle Rocket Spinner', description: 'Thread a string through a bottle to make a spinning rocket toy that zooms across the room.', category: 'toy', difficulty: 'medium', materials: ['1 plastic bottle', 'string', 'a bead or button'], steps: ['Poke two holes in the bottle.', 'Thread string through and knot a bead inside.', 'Pull the string taut and spin.'] },
      { title: 'Sensory Bottle', description: 'Fill a bottle with water, glitter, and beads for a calming sensory toy for kids.', category: 'toy', difficulty: 'easy', materials: ['1 plastic bottle', 'water', 'glitter', 'beads or buttons'], steps: ['Fill the bottle with water.', 'Add glitter and beads.', 'Glue the cap shut and shake.'] },
      { title: 'Bottle Bird Feeder', description: 'Poke holes and add wooden spoons to a bottle to make a hanging bird feeder.', category: 'toy', difficulty: 'medium', materials: ['1 plastic bottle', '2 wooden spoons', 'string', 'bird seed'], steps: ['Poke two holes and insert spoons as perches.', 'Add small seed holes above each spoon.', 'Fill with seed and hang outside.'] },
      { title: 'Bottle Cat Treat Puzzle', description: 'Cut holes in a bottle and hide treats inside for a cat to fish out.', category: 'toy', difficulty: 'easy', materials: ['1 plastic bottle', 'scissors', 'cat treats'], steps: ['Cut a few small holes around the bottle.', 'Drop in a handful of treats.', 'Let your cat bat and roll it to get them out.'] },
      { title: 'Bottle Dog Fetch Toy', description: 'Wrap a bottle in old fabric to make a crinkly fetch toy for dogs.', category: 'toy', difficulty: 'easy', materials: ['1 plastic bottle', 'an old sock or fabric', 'scissors'], steps: ['Remove the cap and any plastic rings.', 'Stuff the bottle into an old sock or wrap in fabric.', 'Tie the end and toss for your dog to fetch.'] },
    ],
  },
  {
    keywords: ['cardboard', 'box', 'carton', 'paper'],
    daily: [
      { title: 'Cardboard Desk Organizer', description: 'Cut and stack cardboard tubes and boxes into a modular desk organizer for pens and cables.', category: 'daily', difficulty: 'medium', materials: ['cardboard boxes', 'scissors', 'glue or tape', 'ruler'], steps: ['Cut the cardboard into even strips and tubes.', 'Notch the strips so they slot together.', 'Stack and glue into compartments.'] },
      { title: 'Cardboard Laptop Stand', description: 'Fold sturdy cardboard into an angled laptop stand for better posture.', category: 'daily', difficulty: 'medium', materials: ['sturdy cardboard', 'craft knife', 'ruler', 'glue'], steps: ['Cut two angled side panels.', 'Cut a top and base.', 'Glue into a stand and let it dry.'] },
      { title: 'Cardboard Drawer Dividers', description: 'Cut cardboard into cross-shaped dividers to organize messy drawers.', category: 'daily', difficulty: 'easy', materials: ['cardboard', 'craft knife', 'ruler'], steps: ['Measure your drawer depth.', 'Cut strips and notch them halfway.', 'Slide them together to make a grid.'] },
    ],
    decoration: [
      { title: 'Cardboard Wall Art', description: 'Layer cut cardboard shapes into a geometric wall sculpture and paint it to match your room.', category: 'decoration', difficulty: 'medium', materials: ['cardboard', 'craft knife', 'acrylic paint', 'glue'], steps: ['Sketch a geometric design.', 'Cut shapes of varying sizes.', 'Layer and glue, then paint.'] },
      { title: 'Cardboard Trophy Head', description: 'Build a low-poly animal trophy head from folded cardboard for a quirky wall mount.', category: 'decoration', difficulty: 'hard', materials: ['cardboard', 'template', 'craft knife', 'glue'], steps: ['Print or draw a template.', 'Cut and score the pieces.', 'Fold and glue into a 3D head.'] },
      { title: 'Cardboard Picture Frame', description: 'Layer cardboard strips into a textured picture frame and paint or decorate it.', category: 'decoration', difficulty: 'easy', materials: ['cardboard', 'craft knife', 'glue', 'paint'], steps: ['Cut a frame shape from cardboard.', 'Layer strips for texture.', 'Paint and insert a photo.'] },
      { title: 'Cardboard Clock', description: 'Cut a cardboard circle and attach a clock mechanism to make a custom wall clock.', category: 'decoration', difficulty: 'medium', materials: ['cardboard', 'clock mechanism', 'craft knife', 'paint', 'numbers (optional)'], steps: ['Cut a circle from cardboard.', 'Paint and add numbers.', 'Insert the clock mechanism and hang.'] },
    ],
    toy: [
      { title: 'Cardboard Marble Run', description: 'Tape cardboard tubes and folded chutes to a wall to build a marble run.', category: 'toy', difficulty: 'hard', materials: ['cardboard tubes', 'tape', 'marbles', 'a wall or board'], steps: ['Cut tubes into chutes.', 'Tape them at angles on a board.', 'Drop a marble at the top and adjust until it flows.'] },
      { title: 'Cardboard Dollhouse', description: 'Turn a shoe box into a multi-room dollhouse with cut-out furniture.', category: 'toy', difficulty: 'medium', materials: ['shoe box', 'cardboard scraps', 'scissors', 'glue', 'paint'], steps: ['Cut doorways between rooms.', 'Make furniture from scraps.', 'Paint and decorate.'] },
      { title: 'Cardboard Sword & Shield', description: 'Cut cardboard into a knight sword and shield for imaginative play.', category: 'toy', difficulty: 'easy', materials: ['cardboard', 'craft knife', 'paint', 'tape'], steps: ['Cut a sword and shield shape.', 'Add a handle from a cardboard strip.', 'Paint and decorate.'] },
      { title: 'Cardboard Car Track', description: 'Draw roads and parking spots on a flattened box for a foldable toy car track.', category: 'toy', difficulty: 'easy', materials: ['a big cardboard box', 'markers', 'toy cars'], steps: ['Flatten the box.', 'Draw roads, intersections, and parking.', 'Drive toy cars along the roads.'] },
      { title: 'Cardboard Cat Scratcher', description: 'Cut cardboard into strips and glue them into a pad for a cat to scratch.', category: 'toy', difficulty: 'easy', materials: ['cardboard', 'craft knife', 'non-toxic glue'], steps: ['Cut cardboard into even strips.', 'Roll each strip into a tight coil.', 'Stack and glue the coils into a flat pad and let your cat scratch.'] },
      { title: 'Cardboard Hamster House', description: 'Cut doorways and rooms in a box to make a cozy hamster house.', category: 'toy', difficulty: 'medium', materials: ['a shoe box', 'cardboard scraps', 'non-toxic glue'], steps: ['Cut doorways between rooms.', 'Add ramps and little shelves.', 'Place in the cage and let your hamster explore.'] },
    ],
  },
  {
    keywords: ['glass', 'jar', 'bottle glass'],
    daily: [
      { title: 'Glass Jar Storage', description: 'Clean glass jars become airtight storage for pantry staples, buttons, or hardware.', category: 'daily', difficulty: 'easy', materials: ['glass jars with lids', 'soap', 'labels (optional)'], steps: ['Soak jars to remove labels.', 'Wash and dry thoroughly.', 'Fill and label for easy finding.'] },
      { title: 'Jar Spice Rack', description: 'Mount jar lids under a shelf and screw jars in for a hanging spice rack.', category: 'daily', difficulty: 'medium', materials: ['small jars', 'a board or shelf', 'screws', 'drill'], steps: ['Screw lids to the underside of a shelf.', 'Fill jars with spices.', 'Twist jars into their lids.'] },
      { title: 'Jar Drinking Glass', description: 'Smooth the rim of a cut jar to make a rustic drinking glass.', category: 'daily', difficulty: 'hard', materials: ['glass jar', 'glass cutter', 'sandpaper'], steps: ['Score the jar with a glass cutter.', 'Snap along the score line.', 'Sand the rim until smooth.'] },
      { title: 'Jar Soap Dispenser', description: 'Attach a pump lid to a jar to make a rustic soap dispenser for the bathroom.', category: 'daily', difficulty: 'medium', materials: ['a glass jar', 'a soap pump', 'glue', 'soap'], steps: ['Clean the jar lid.', 'Glue the pump to the lid.', 'Fill with soap and screw on.'] },
    ],
    decoration: [
      { title: 'Painted Glass Vase', description: 'Paint the outside of a glass jar with translucent acrylics to create a stained-glass vase.', category: 'decoration', difficulty: 'medium', materials: ['glass jar', 'glass paint', 'brush', 'ribbon (optional)'], steps: ['Clean and dry the jar.', 'Paint patterns on the outside.', 'Add a ribbon around the rim once dry.'] },
      { title: 'Hanging Jar Terrarium', description: 'Fill a jar with pebbles, soil, and moss, then hang it as a mini terrarium.', category: 'decoration', difficulty: 'medium', materials: ['glass jar', 'pebbles', 'soil', 'moss', 'twine'], steps: ['Layer pebbles then soil.', 'Add moss and small plants.', 'Tie twine and hang.'] },
      { title: 'Jar Candle Holder', description: 'Decorate a jar with twine and lace to make a cozy candle holder.', category: 'decoration', difficulty: 'easy', materials: ['glass jar', 'twine', 'lace or fabric', 'glue', 'tea light'], steps: ['Wrap twine around the jar rim.', 'Glue a lace strip around the middle.', 'Add a tea light.'] },
      { title: 'Jar Photo Display', description: 'Clip photos to the inside of a jar lid and hang it as a floating photo display.', category: 'decoration', difficulty: 'easy', materials: ['a jar', 'photos', 'mini clips', 'twine'], steps: ['Clip photos to a length of twine.', 'Drape the twine inside the jar.', 'Seal the lid and display.'] },
    ],
    toy: [
      { title: 'Jar Lantern Fairy House', description: 'Decorate a jar with cut paper and a tea light to make a glowing fairy house.', category: 'toy', difficulty: 'medium', materials: ['glass jar', 'colored paper', 'glue', 'LED tea light'], steps: ['Cut windows and doors from paper.', 'Glue them around the jar.', 'Drop in an LED light and enjoy the glow.'] },
      { title: 'Memory Guessing Jar', description: 'Fill a jar with small objects and play a memory game — guess what is missing.', category: 'toy', difficulty: 'easy', materials: ['a jar', 'small trinkets', 'a cloth'], steps: ['Fill the jar with trinkets.', 'Let players look for 10 seconds.', 'Cover, remove one, and ask what is gone.'] },
      { title: 'Jar Snow Globe', description: 'Fill a jar with water and glitter to make a homemade snow globe.', category: 'toy', difficulty: 'medium', materials: ['a jar with lid', 'water', 'glitter', 'a small toy', 'glue'], steps: ['Glue a small toy to the inside of the lid.', 'Fill the jar with water and glitter.', 'Screw the lid on tight and flip.'] },
      { title: 'Jar Coin Bank', description: 'Cut a coin slot in a jar lid and decorate the jar as a savings bank.', category: 'toy', difficulty: 'easy', materials: ['a jar with lid', 'craft knife', 'paint', 'stickers'], steps: ['Cut a coin slot in the lid.', 'Paint and decorate the jar.', 'Drop in coins and watch savings grow.'] },
      { title: 'Jar Betta Fish Hideout', description: 'Decorate a clean jar to serve as a cozy hideout for a small pet fish.', category: 'toy', difficulty: 'medium', materials: ['a large glass jar', 'aquarium-safe gravel', 'a small plant'], steps: ['Rinse the jar thoroughly with no soap.', 'Add a layer of gravel and a small plant.', 'Fill with dechlorinated water and let your fish explore.'] },
      { title: 'Jar Cat Treat Shaker', description: 'Poke holes in a jar lid and put treats inside for a cat to shake out.', category: 'toy', difficulty: 'easy', materials: ['a jar with lid', 'a nail', 'cat treats'], steps: ['Poke a few small holes in the lid.', 'Drop in a few treats.', 'Let your cat bat the jar to shake them out.'] },
    ],
  },
  {
    keywords: ['metal', 'can', 'tin', 'aluminum'],
    daily: [
      { title: 'Tin Can Pen Pot', description: 'Wrap a cleaned tin can in twine or fabric for a rustic pen pot.', category: 'daily', difficulty: 'easy', materials: ['tin can', 'twine or fabric', 'glue', 'scissors'], steps: ['Sand any sharp edges.', 'Glue twine around the can or wrap with fabric.', 'Fill with pens or utensils.'] },
      { title: 'Tin Can Herb Garden', description: 'Paint cans and plant herbs in them for a windowsill garden.', category: 'daily', difficulty: 'easy', materials: ['tin cans', 'paint', 'soil', 'herb seedlings'], steps: ['Paint and dry the cans.', 'Add soil and a herb seedling.', 'Water and place on a sunny sill.'] },
      { title: 'Tin Can Utensil Caddy', description: 'Glue several cans together and add a handle for a picnic utensil caddy.', category: 'daily', difficulty: 'medium', materials: ['3-4 tin cans', 'strong glue', 'a wire handle', 'paint'], steps: ['Paint and dry the cans.', 'Glue them side by side.', 'Attach a wire handle on top.'] },
      { title: 'Tin Can Key Hook', description: 'Mount a can on the wall and add hooks inside to hold keys by the door.', category: 'daily', difficulty: 'medium', materials: ['a tin can', 'small hooks', 'screws', 'paint'], steps: ['Paint the can and let it dry.', 'Screw small hooks inside the rim.', 'Mount on the wall by the door.'] },
    ],
    decoration: [
      { title: 'Tin Can Wind Chime', description: 'Paint cans of different sizes and hang them to clink in the breeze.', category: 'decoration', difficulty: 'hard', materials: ['several tin cans', 'paint', 'string', 'a stick', 'a drill'], steps: ['Paint and dry the cans.', 'Drill a hole in the bottom of each.', 'Tie them at different lengths to a stick and hang.'] },
      { title: 'Tin Can Lanterns', description: 'Punch holes in cans to make glowing lanterns for the garden.', category: 'decoration', difficulty: 'medium', materials: ['tin cans', 'hammer and nail', 'candles'], steps: ['Fill cans with water and freeze.', 'Punch a pattern of holes.', 'Melt the ice, add a candle.'] },
      { title: 'Tin Can Pencil Planter', description: 'Paint cans in bold patterns and cluster them as a desk planter for succulents.', category: 'decoration', difficulty: 'easy', materials: ['tin cans', 'acrylic paint', 'brushes', 'soil', 'succulents'], steps: ['Paint cans in bold patterns.', 'Let them dry fully.', 'Add soil and plant succulents.'] },
      { title: 'Tin Can Flower Pots', description: 'Paint cans with floral designs and use them as small flower pots for windowsills.', category: 'decoration', difficulty: 'easy', materials: ['tin cans', 'acrylic paint', 'soil', 'flowers'], steps: ['Paint cans with floral designs.', 'Let them dry.', 'Add soil and plant flowers.'] },
    ],
    toy: [
      { title: 'Can Walkers Stilts', description: 'Punch holes in large cans and add string handles for kid-sized stilts.', category: 'toy', difficulty: 'medium', materials: ['2 large cans', 'string', 'a nail', 'hammer'], steps: ['Punch two holes near the top of each can.', 'Thread string through and knot.', 'Stand on the cans and hold the strings to walk.'] },
      { title: 'Tin Can Telephone', description: 'Connect two cans with string for a classic tin-can phone.', category: 'toy', difficulty: 'easy', materials: ['2 tin cans', 'string', 'a nail'], steps: ['Punch a hole in the bottom of each can.', 'Thread string through and knot inside.', 'Pull the string taut and talk.'] },
      { title: 'Can Drum Set', description: 'Decorate cans with paper and use spoons as drumsticks for a mini drum kit.', category: 'toy', difficulty: 'easy', materials: ['several tin cans', 'balloons or paper', 'spoons', 'tape'], steps: ['Cut balloon tops and stretch over can openings.', 'Tape the edges.', 'Use spoons as drumsticks.'] },
      { title: 'Tin Can Robot', description: 'Stack cans and add wire arms and bottle-cap eyes to build a tin can robot.', category: 'toy', difficulty: 'hard', materials: ['several cans', 'wire', 'bottle caps', 'glue', 'paint'], steps: ['Stack and glue cans for the body.', 'Bend wire into arms and legs.', 'Add bottle-cap eyes and paint.'] },
      { title: 'Can Dog Treat Dispenser', description: 'Punch holes in a can and hide treats inside for a dog to roll out.', category: 'toy', difficulty: 'medium', materials: ['a clean tin can', 'a nail', 'dog treats'], steps: ['Sand the rim smooth.', 'Punch a few holes around the can.', 'Drop in treats and let your dog roll it to get them.'] },
      { title: 'Can Cat Chaser', description: 'Drop a bell inside a can and seal it for a cat to chase and bat.', category: 'toy', difficulty: 'easy', materials: ['a tin can', 'a small bell', 'tape'], steps: ['Drop a small bell inside the can.', 'Tape the opening shut securely.', 'Roll it across the floor for your cat to chase.'] },
    ],
  },
  {
    keywords: ['fabric', 'cloth', 'textile', 'clothes', 'jeans', 'shirt'],
    daily: [
      { title: 'Fabric Produce Bags', description: 'Sew old fabric into reusable produce bags to replace plastic at the store.', category: 'daily', difficulty: 'medium', materials: ['old fabric', 'needle and thread', 'drawstring', 'scissors'], steps: ['Cut fabric into rectangles.', 'Fold and sew the sides.', 'Thread a drawstring through the top hem.'] },
      { title: 'T-Shirt Cleaning Rags', description: 'Cut old t-shirts into reusable cleaning rags — no paper towels needed.', category: 'daily', difficulty: 'easy', materials: ['old t-shirts', 'scissors'], steps: ['Lay the shirt flat.', 'Cut into squares.', 'Hem edges if you want them to last.'] },
      { title: 'Fabric Coffee Cozy', description: 'Sew a strip of old fabric into a reusable sleeve for coffee cups.', category: 'daily', difficulty: 'easy', materials: ['old fabric', 'needle and thread', 'a button'], steps: ['Cut a strip of fabric.', 'Sew it into a cylinder.', 'Add a button closure.'] },
      { title: 'Fabric Lunch Wrap', description: 'Sew fabric into a reusable wrap that folds around sandwiches or snacks.', category: 'daily', difficulty: 'medium', materials: ['old fabric', 'needle and thread', 'a button', 'beeswax (optional)'], steps: ['Cut a square of fabric.', 'Hem the edges.', 'Add a button strap to fold and close.'] },
    ],
    decoration: [
      { title: 'Rag Rug', description: 'Braid strips of old fabric into a colorful rag rug for the kitchen.', category: 'decoration', difficulty: 'hard', materials: ['lots of fabric scraps', 'scissors', 'thread'], steps: ['Cut fabric into long strips.', 'Braid three strips together.', 'Coil the braid and stitch it into a rug.'] },
      { title: 'Fabric Wall Hanging', description: 'Stretch a pretty piece of fabric over a frame for instant wall art.', category: 'decoration', difficulty: 'easy', materials: ['a piece of fabric', 'a frame or dowel', 'staples or glue'], steps: ['Iron the fabric flat.', 'Stretch over a frame.', 'Staple or glue in place.'] },
      { title: 'Fabric Bunting Banner', description: 'Cut triangles from old fabric and string them into a festive banner.', category: 'decoration', difficulty: 'easy', materials: ['old fabric', 'scissors', 'string or ribbon', 'glue'], steps: ['Cut triangles from fabric.', 'Fold the top edge over the string.', 'Glue in place and hang.'] },
      { title: 'Fabric Pouf Ottoman', description: 'Stuff old fabric into a sewn cushion cover to make a floor pouf ottoman.', category: 'decoration', difficulty: 'hard', materials: ['lots of fabric scraps', 'sturdy fabric for cover', 'needle and thread'], steps: ['Sew a large cushion cover.', 'Stuff tightly with fabric scraps.', 'Sew the opening shut.'] },
    ],
    toy: [
      { title: 'Sock Puppet', description: 'Turn a lonely sock into a hand puppet with button eyes and yarn hair.', category: 'toy', difficulty: 'easy', materials: ['a sock', 'buttons', 'yarn', 'glue or needle'], steps: ['Put the sock on your hand.', 'Glue buttons for eyes and yarn for hair.', 'Give your puppet a name and a voice!'] },
      { title: 'Fabric Beanbags', description: 'Sew small fabric squares into beanbags filled with dry rice.', category: 'toy', difficulty: 'medium', materials: ['fabric scraps', 'dry rice', 'needle and thread'], steps: ['Cut squares of fabric.', 'Sew three sides, fill with rice.', 'Sew the fourth side shut and toss.'] },
      { title: 'Stuffed Animal', description: 'Cut and sew old fabric into a simple stuffed animal shape.', category: 'toy', difficulty: 'hard', materials: ['old fabric', 'needle and thread', 'cotton stuffing', 'buttons'], steps: ['Draw an animal shape on the fabric.', 'Cut two pieces and sew them together.', 'Stuff and sew shut, add button eyes.'] },
      { title: 'Fabric Kite', description: 'Stretch old fabric over a stick frame to make a simple kite.', category: 'toy', difficulty: 'hard', materials: ['old fabric', '2 sticks', 'string', 'scissors', 'tape'], steps: ['Tie sticks into a cross frame.', 'Cut fabric to fit and tape it on.', 'Attach a string tail and fly it.'] },
      { title: 'Fabric Dog Tug Toy', description: 'Braid old fabric strips into a tough tug toy for dogs.', category: 'toy', difficulty: 'easy', materials: ['old fabric or t-shirts', 'scissors'], steps: ['Cut three long strips of fabric.', 'Knot one end and braid tightly.', 'Knot the other end and let your dog tug.'] },
      { title: 'Fabric Catnip Mouse', description: 'Sew a small fabric pouch with catnip inside for a cat to pounce on.', category: 'toy', difficulty: 'medium', materials: ['fabric scraps', 'needle and thread', 'catnip'], steps: ['Cut a mouse shape from fabric.', 'Sew two pieces together, leaving a gap.', 'Stuff with catnip, sew shut, and toss to your cat.'] },
    ],
  },
];

const pt: MaterialEntry[] = [
  {
    keywords: ['plastic', 'bottle', 'pet', 'garrafa', 'plastico', 'plástico', 'garrafa pet'],
    daily: [
      { title: 'Regador de Plantas com Garrafa', description: 'Transforme uma garrafa plástica em um regador de gotejamento lento que mantém suas plantas hidratadas por dias.', category: 'daily', difficulty: 'easy', materials: ['1 garrafa plástica', 'uma agulha ou prego', 'água'], steps: ['Lave a garrafa e remova o rótulo.', 'Fure um pequeno buraco perto da base.', 'Encha com água, rosqueie a tampa e enterre perto de uma planta.'] },
      { title: 'Porta-Escovas de Garrafa', description: 'Corte o topo de uma garrafa para fazer um porta-escovas de parede para o banheiro.', category: 'daily', difficulty: 'medium', materials: ['1 garrafa plástica', 'tesoura', 'cola ou ventosa'], steps: ['Corte o terço superior da garrafa.', 'Lixe a borda cortada.', 'Monte na parede e coloque as escovas.'] },
      { title: 'Concha de Garrafa', description: 'Corte uma garrafa na diagonal para fazer uma concha para ração, terra de jardim ou sabão em pó.', category: 'daily', difficulty: 'easy', materials: ['1 garrafa plástica', 'tesoura ou estilete'], steps: ['Corte a garrafa na diagonal de cima a baixo.', 'Mantenha a tampa para servir de cabo.', 'Lije a borda cortada.'] },
      { title: 'Estojo de Garrafa', description: 'Una dois fundos de garrafa com um zíper para fazer um estojo transparente.', category: 'daily', difficulty: 'medium', materials: ['2 garrafas plásticas', 'um zíper', 'cola'], steps: ['Corte os fundos das duas garrafas.', 'Cole um zíper entre as duas bordas cortadas.', 'Abra e encha com canetas.'] },
    ],
    decoration: [
      { title: 'Moldura de Mosaico de Tampas', description: 'Cole tampas coloridas em um mosaico sobre uma moldura de foto antiga.', category: 'decoration', difficulty: 'medium', materials: ['Muitas tampas', 'moldura de foto antiga', 'cola forte', 'tinta (opcional)'], steps: ['Separe as tampas por cor.', 'Planeje um padrão na moldura.', 'Cole cada tampa no lugar e deixe secar durante a noite.'] },
      { title: 'Lampada de Flor de Garrafa', description: 'Corte fundos de garrafa em formato de pétalas e empilhe-os em uma luminária pendente.', category: 'decoration', difficulty: 'hard', materials: ['Várias garrafas plásticas', 'tesoura', 'luz LED', 'arame'], steps: ['Corte os fundos das garrafas.', 'Molde as pétalas e sobreponha-as.', 'Insira uma luz LED e pendure.'] },
      { title: 'Vasos de Garrafa', description: 'Corte garrafas ao meio, pinte e pendure-as como um jardim vertical na parede.', category: 'decoration', difficulty: 'medium', materials: ['garrafas plásticas', 'tinta', 'barbante', 'terra', 'plantas pequenas'], steps: ['Corte as garrafas ao meio e pinte.', 'Passe o barbante pelo topo.', 'Adicione terra e plantas, depois pendure.'] },
      { title: 'Casa de Pássaros de Garrafa', description: 'Corte um buraco e pinte uma garrafa para fazer uma casa de pássaros à prova de tempo para o jardim.', category: 'decoration', difficulty: 'hard', materials: ['1 garrafa plástica grande', 'tinta', 'corda', 'um graveto'], steps: ['Corte um buraco de entrada perto do topo.', 'Insira um graveto como poleiro abaixo do buraco.', 'Pinte, adicione corda e pendure lá fora.'] },
    ],
    toy: [
      { title: 'Jogo de Boliche de Garrafas', description: 'Encha garrafas com um pouco de arroz e use-as como pinos de boliche.', category: 'toy', difficulty: 'easy', materials: ['6 garrafas plásticas', 'arroz', 'uma bola macia'], steps: ['Adicione um punhado de arroz em cada garrafa para peso.', 'Arrume-as em triângulo.', 'Role a bola e jogue!'] },
      { title: 'Foguete Giratório de Garrafa', description: 'Passe uma corda por uma garrafa para fazer um brinquedo giratório que zoom pela sala.', category: 'toy', difficulty: 'medium', materials: ['1 garrafa plástica', 'corda', 'uma conta ou botão'], steps: ['Fure dois buracos na garrafa.', 'Passe a corda e dê um nó numa conta por dentro.', 'Puxe a corda esticada e gire.'] },
      { title: 'Garrafa Sensorial', description: 'Encha uma garrafa com água, gliter e contas para um brinquedo sensorial calmante para crianças.', category: 'toy', difficulty: 'easy', materials: ['1 garrafa plástica', 'água', 'gliter', 'contas ou botões'], steps: ['Encha a garrafa com água.', 'Adicione gliter e contas.', 'Cole a tampa e agite.'] },
      { title: 'Comedouro de Pássaros de Garrafa', description: 'Fure e adicione colheres de madeira a uma garrafa para fazer um comedouro pendente.', category: 'toy', difficulty: 'medium', materials: ['1 garrafa plástica', '2 colheres de madeira', 'corda', 'sementes para pássaros'], steps: ['Fure dois buracos e insira colheres como poleiros.', 'Faça pequenos buracos para sementes acima de cada colher.', 'Encha com sementes e pendure lá fora.'] },
      { title: 'Quebra-Cabeça de Petisco para Gato', description: 'Corte buracos em uma garrafa e esconda petiscos dentro para o gato tirar.', category: 'toy', difficulty: 'easy', materials: ['1 garrafa plástica', 'tesoura', 'petiscos para gato'], steps: ['Corte alguns buracos pequenos ao redor da garrafa.', 'Coloque um punhado de petiscos dentro.', 'Deixe seu gato bater e rolar para tirá-los.'] },
      { title: 'Brinquedo de Buscar para Cão', description: 'Enrole uma garrafa em tecido velho para fazer um brinquedo que faz barulho para cães.', category: 'toy', difficulty: 'easy', materials: ['1 garrafa plástica', 'uma meia velha ou tecido', 'tesoura'], steps: ['Remova a tampa e anéis de plástico.', 'Enfie a garrafa numa meia velha ou enrole em tecido.', 'Dê um nó na ponta e jogue para seu cão buscar.'] },
    ],
  },
  {
    keywords: ['cardboard', 'box', 'carton', 'paper', 'papelao', 'papelão', 'caixa', 'papel'],
    daily: [
      { title: 'Organizador de Mesa de Papelão', description: 'Corte e empilhe tubos e caixas de papelão em um organizador modular para canetas e cabos.', category: 'daily', difficulty: 'medium', materials: ['caixas de papelão', 'tesoura', 'cola ou fita', 'régua'], steps: ['Corte o papelão em tiras e tubos uniformes.', 'Faça entalhes nas tiras para encaixá-las.', 'Empilhe e cole em compartimentos.'] },
      { title: 'Suporte de Notebook de Papelão', description: 'Dobre papelão resistente em um suporte inclinado para melhor postura.', category: 'daily', difficulty: 'medium', materials: ['papelão resistente', 'estilete', 'régua', 'cola'], steps: ['Corte dois painéis laterais inclinados.', 'Corte um topo e uma base.', 'Cole formando um suporte e deixe secar.'] },
      { title: 'Divisórias de Gaveta de Papelão', description: 'Corte papelão em divisórias em forma de cruz para organizar gavetas bagunçadas.', category: 'daily', difficulty: 'easy', materials: ['papelão', 'estilete', 'régua'], steps: ['Meça a profundidade da gaveta.', 'Corte tiras e faça entalhes até a metade.', 'Encaixe-as para formar uma grade.'] },
    ],
    decoration: [
      { title: 'Arte de Parede de Papelão', description: 'Sobreponha formas recortadas de papelão em uma escultura geométrica e pinte para combinar com seu quarto.', category: 'decoration', difficulty: 'medium', materials: ['papelão', 'estilete', 'tinta acrílica', 'cola'], steps: ['Esboce um design geométrico.', 'Corte formas de tamanhos variados.', 'Sobreponha e cole, depois pinte.'] },
      { title: 'Cabeça de Troféu de Papelão', description: 'Construa uma cabeça de animal low-poly de papelão dobrado para uma montagem de parede divertida.', category: 'decoration', difficulty: 'hard', materials: ['papelão', 'molde', 'estilete', 'cola'], steps: ['Imprima ou desenhe um molde.', 'Corte e risque as peças.', 'Dobre e cole em uma cabeça 3D.'] },
      { title: 'Moldura de Papelão', description: 'Sobreponha tiras de papelão em uma moldura texturizada e pinte ou decore.', category: 'decoration', difficulty: 'easy', materials: ['papelão', 'estilete', 'cola', 'tinta'], steps: ['Corte uma moldura de papelão.', 'Sobreponha tiras para textura.', 'Pinte e insira uma foto.'] },
      { title: 'Relógio de Papelão', description: 'Corte um círculo de papelão e acopla um mecanismo de relógio para fazer um relógio de parede personalizado.', category: 'decoration', difficulty: 'medium', materials: ['papelão', 'mecanismo de relógio', 'estilete', 'tinta', 'números (opcional)'], steps: ['Corte um círculo de papelão.', 'Pinte e adicione números.', 'Insira o mecanismo e pendure.'] },
    ],
    toy: [
      { title: 'Labirinto de Bolinhas de Papelão', description: 'Cole tubos de papelão e calhas dobradas na parede para construir um labirinto de bolinhas.', category: 'toy', difficulty: 'hard', materials: ['tubos de papelão', 'fita', 'bolinhas', 'uma parede ou tábua'], steps: ['Corte tubos em calhas.', 'Cole-as em ângulos numa tábua.', 'Solte uma bolinha no topo e ajuste até fluir.'] },
      { title: 'Casinha de Bonecas de Papelão', description: 'Transforme uma caixa de sapatos em uma casinha de bonecas com vários cômodos e móveis recortados.', category: 'toy', difficulty: 'medium', materials: ['caixa de sapatos', 'recortes de papelão', 'tesoura', 'cola', 'tinta'], steps: ['Corte portas entre os cômodos.', 'Faça móveis com recortes.', 'Pinte e decore.'] },
      { title: 'Espada e Escudo de Papelão', description: 'Corte papelão em uma espada e escudo de cavaleiro para brincadeiras imaginativas.', category: 'toy', difficulty: 'easy', materials: ['papelão', 'estilete', 'tinta', 'fita'], steps: ['Corte a forma de espada e escudo.', 'Adicione um cabo com uma tira de papelão.', 'Pinte e decore.'] },
      { title: 'Pista de Carrinhos de Papelão', description: 'Desenhe estradas e vagas em uma caixa achatada para uma pista dobrável de carrinhos.', category: 'toy', difficulty: 'easy', materials: ['uma caixa grande de papelão', 'marcadores', 'carrinhos'], steps: ['Achate a caixa.', 'Desenhe estradas, cruzamentos e vagas.', 'Dirija os carrinhos pelas estradas.'] },
      { title: 'Arranhador de Gato de Papelão', description: 'Corte papelão em tiras e cole-as em uma almofada para o gato arranhar.', category: 'toy', difficulty: 'easy', materials: ['papelão', 'estilete', 'cola não tóxica'], steps: ['Corte o papelão em tiras uniformes.', 'Enrole cada tira em espiral apertada.', 'Empilhe e cole as espirais em uma almofada plana e deixe seu gato arranhar.'] },
      { title: 'Casa de Hamster de Papelão', description: 'Corte portas e cômodos em uma caixa para fazer uma casa aconchegante para hamster.', category: 'toy', difficulty: 'medium', materials: ['uma caixa de sapatos', 'recortes de papelão', 'cola não tóxica'], steps: ['Corte portas entre os cômodos.', 'Adicione rampas e prateleiras pequenas.', 'Coloque na gaiola e deixe seu hamster explorar.'] },
    ],
  },
  {
    keywords: ['glass', 'jar', 'bottle glass', 'vidro', 'pote', 'frasco'],
    daily: [
      { title: 'Armazenamento em Potes de Vidro', description: 'Potes de vidro limpos viram armazenamento hermético para despensa, botões ou ferragens.', category: 'daily', difficulty: 'easy', materials: ['potes de vidro com tampa', 'sabão', 'etiquetas (opcional)'], steps: ['Deixe os potes de molho para remover rótulos.', 'Lave e seque bem.', 'Encha e etiquete para fácil localização.'] },
      { title: 'Estante de Especiarias de Potes', description: 'Parafuse as tampas dos potes sob uma prateleira e enrosque os potes para um suporte pendente.', category: 'daily', difficulty: 'medium', materials: ['potes pequenos', 'uma tábua ou prateleira', 'parafusos', 'furadeira'], steps: ['Parafuse as tampas na parte inferior de uma prateleira.', 'Encha os potes com especiarias.', 'Enrosque os potes nas tampas.'] },
      { title: 'Copo de Vidro de Pote', description: 'Lixe a borda de um pote cortado para fazer um copo rústico.', category: 'daily', difficulty: 'hard', materials: ['pote de vidro', 'cortador de vidro', 'lixa'], steps: ['Risque o pote com um cortador de vidro.', 'Quebre ao longo da linha riscada.', 'Lije a borda até ficar lisa.'] },
      { title: 'Dispensador de Sabão de Pote', description: 'Acopla uma tampa com bomba a um pote para fazer um dispensador de sabão rústico.', category: 'daily', difficulty: 'medium', materials: ['um pote de vidro', 'uma bomba de sabão', 'cola', 'sabão'], steps: ['Limpe a tampa do pote.', 'Cole a bomba na tampa.', 'Encha com sabão e rosqueie.'] },
    ],
    decoration: [
      { title: 'Vaso de Vidro Pintado', description: 'Pinte o exterior de um pote de vidro com acrílicos translúcidos para criar um vaso vitral.', category: 'decoration', difficulty: 'medium', materials: ['pote de vidro', 'tinta para vidro', 'pincel', 'fita (opcional)'], steps: ['Limpe e seque o pote.', 'Pinte padrões no exterior.', 'Adicione uma fita ao redor da borda quando seco.'] },
      { title: 'Terrário Pendurado de Pote', description: 'Encha um pote com pedrinhas, terra e musgo, depois pendure como um mini terrário.', category: 'decoration', difficulty: 'medium', materials: ['pote de vidro', 'pedrinhas', 'terra', 'musgo', 'barbante'], steps: ['Forre pedrinhas depois terra.', 'Adicione musgo e plantas pequenas.', 'Amarre o barbante e pendure.'] },
      { title: 'Luminária de Pote', description: 'Decore um pote com barbante e renda para fazer uma luminária aconchegante.', category: 'decoration', difficulty: 'easy', materials: ['pote de vidro', 'barbante', 'renda ou tecido', 'cola', 'vela de chá'], steps: ['Enrole o barbante ao redor da borda do pote.', 'Cole uma tira de renda ao redor do meio.', 'Adicione uma vela de chá.'] },
      { title: 'Expositor de Fotos de Pote', description: 'Prenda fotos na parte interna da tampa do pote e pendure como um expositor flutuante.', category: 'decoration', difficulty: 'easy', materials: ['um pote', 'fotos', 'clips pequenos', 'barbante'], steps: ['Prenda fotos num comprimento de barbante.', 'Drapeje o barbante dentro do pote.', 'Sele a tampa e exiba.'] },
    ],
    toy: [
      { title: 'Luminária Casinha de Fadas', description: 'Decore um pote com papel recortado e uma vela de chá para fazer uma casinha de fadas brilhante.', category: 'toy', difficulty: 'medium', materials: ['pote de vidro', 'papel colorido', 'cola', 'vela LED'], steps: ['Corte janelas e portas de papel.', 'Cole-as ao redor do pote.', 'Coloque uma luz LED e aproveite o brilho.'] },
      { title: 'Pote da Memória', description: 'Encha um pote com pequenos objetos e jogue um jogo de memória — adivinhe o que falta.', category: 'toy', difficulty: 'easy', materials: ['um pote', 'pequenos objetos', 'um pano'], steps: ['Encha o pote com objetos.', 'Deixe os jogadores olharem por 10 segundos.', 'Cubra, remova um e pergunte o que sumiu.'] },
      { title: 'Globo de Neve de Pote', description: 'Encha um pote com água e gliter para fazer uma bola de neve caseira.', category: 'toy', difficulty: 'medium', materials: ['um pote com tampa', 'água', 'gliter', 'um brinquedo pequeno', 'cola'], steps: ['Cole um brinquedo pequeno na parte interna da tampa.', 'Encha o pote com água e gliter.', 'Rosqueie a tampa firmemente e vire.'] },
      { title: 'Cofrinho de Pote', description: 'Corte uma fenda para moedas na tampa do pote e decore o pote como um cofre.', category: 'toy', difficulty: 'easy', materials: ['um pote com tampa', 'estilete', 'tinta', 'adesivos'], steps: ['Corte uma fenda para moedas na tampa.', 'Pinte e decore o pote.', 'Coloque moedas e veja a poupança crescer.'] },
      { title: 'Esconderijo de Peixe em Pote', description: 'Decore um pote limpo para servir como esconderijo aconchegante para um pequeno peixe de estimação.', category: 'toy', difficulty: 'medium', materials: ['um pote grande de vidro', 'cascalho seguro para aquário', 'uma planta pequena'], steps: ['Enxágue o pote bem sem sabão.', 'Adicione uma camada de cascalho e uma planta pequena.', 'Encha com água sem cloro e deixe seu peixe explorar.'] },
      { title: 'Chocalho de Petisco para Gato', description: 'Fure a tampa do pote e coloque petiscos dentro para o gato chacoalhar.', category: 'toy', difficulty: 'easy', materials: ['um pote com tampa', 'um prego', 'petiscos para gato'], steps: ['Fure alguns buracos pequenos na tampa.', 'Coloque alguns petiscos dentro.', 'Deixe seu gato bater no pote para chacoalhar.'] },
    ],
  },
  {
    keywords: ['metal', 'can', 'tin', 'aluminum', 'lata', 'metal', 'aluminio', 'alumínio'],
    daily: [
      { title: 'Porta-Canetas de Lata', description: 'Enrole uma lata limpa em barbante ou tecido para um porta-canetas rústico.', category: 'daily', difficulty: 'easy', materials: ['lata', 'barbante ou tecido', 'cola', 'tesoura'], steps: ['Lixe bordas afiadas.', 'Cole o barbante ao redor da lata ou enrole em tecido.', 'Encha com canetas ou talheres.'] },
      { title: 'Jardim de Ervas em Latas', description: 'Pinte latas e plante ervas nelas para um jardim de parapeito.', category: 'daily', difficulty: 'easy', materials: ['latas', 'tinta', 'terra', 'mudas de ervas'], steps: ['Pinte e seque as latas.', 'Adicione terra e uma muda de erva.', 'Regue e coloque num parapeito ensolarado.'] },
      { title: 'Cesto de Talheres de Latas', description: 'Cole várias latas e adicione uma alça para um cesto de talheres de piquenique.', category: 'daily', difficulty: 'medium', materials: ['3-4 latas', 'cola forte', 'uma alça de arame', 'tinta'], steps: ['Pinte e seque as latas.', 'Cole-as lado a lado.', 'Prenda uma alça de arame no topo.'] },
      { title: 'Gancho de Chaves de Lata', description: 'Monte uma lata na parede e adicione ganchos dentro para segurar chaves pela porta.', category: 'daily', difficulty: 'medium', materials: ['uma lata', 'pequenos ganchos', 'parafusos', 'tinta'], steps: ['Pinte a lata e deixe secar.', 'Parafuse pequenos ganchos dentro da borda.', 'Monte na parede perto da porta.'] },
    ],
    decoration: [
      { title: 'Móbile de Latas', description: 'Pinte latas de tamanhos diferentes e pendure-as para tilintar na brisa.', category: 'decoration', difficulty: 'hard', materials: ['várias latas', 'tinta', 'corda', 'um graveto', 'uma furadeira'], steps: ['Pinte e seque as latas.', 'Fure um buraco no fundo de cada uma.', 'Amarre-as em comprimentos diferentes num graveto e pendure.'] },
      { title: 'Lanterna de Latas', description: 'Fure latas para fazer lanternas brilhantes para o jardim.', category: 'decoration', difficulty: 'medium', materials: ['latas', 'martelo e prego', 'velas'], steps: ['Encha as latas com água e congele.', 'Fure um padrão de buracos.', 'Derreta o gelo, adicione uma vela.'] },
      { title: 'Vaso de Suculentas de Lata', description: 'Pinte latas com padrões ousados e agrupe-as como vaso de mesa para suculentas.', category: 'decoration', difficulty: 'easy', materials: ['latas', 'tinta acrílica', 'pincéis', 'terra', 'suculentas'], steps: ['Pinte as latas com padrões ousados.', 'Deixe secar completamente.', 'Adicione terra e plante suculentas.'] },
      { title: 'Vasos de Flores de Lata', description: 'Pinte latas com designs florais e use-as como pequenos vasos de flores para parapeitos.', category: 'decoration', difficulty: 'easy', materials: ['latas', 'tinta acrílica', 'terra', 'flores'], steps: ['Pinte as latas com designs florais.', 'Deixe secar.', 'Adicione terra e plante flores.'] },
    ],
    toy: [
      { title: 'Pernas de Pau de Latas', description: 'Fure latas grandes e adicione alças de corda para pernas de pau infantis.', category: 'toy', difficulty: 'medium', materials: ['2 latas grandes', 'corda', 'um prego', 'martelo'], steps: ['Fure dois buracos perto do topo de cada lata.', 'Passe a corda e dê um nó.', 'Suba nas latas e segure as cordas para andar.'] },
      { title: 'Telefone de Lata', description: 'Conecte duas latas com corda para um clássico telefone de lata.', category: 'toy', difficulty: 'easy', materials: ['2 latas', 'corda', 'um prego'], steps: ['Fure um buraco no fundo de cada lata.', 'Passe a corda e dê um nó por dentro.', 'Puxe a corda esticada e converse.'] },
      { title: 'Bateria de Latas', description: 'Decore latas com papel e use colheres como baquetas para uma mini bateria.', category: 'toy', difficulty: 'easy', materials: ['várias latas', 'balões ou papel', 'colheres', 'fita'], steps: ['Corte topo de balões e estique sobre as bocas das latas.', 'Cole as bordas.', 'Use colheres como baquetas.'] },
      { title: 'Robô de Lata', description: 'Empilhe latas e adicione braços de arame e olhos de tampas para construir um robô de lata.', category: 'toy', difficulty: 'hard', materials: ['várias latas', 'arame', 'tampas de garrafa', 'cola', 'tinta'], steps: ['Empilhe e cole latas para o corpo.', 'Dobre arame em braços e pernas.', 'Adicione olhos de tampas e pinte.'] },
      { title: 'Dispensador de Petisco para Cão', description: 'Fure uma lata e esconda petiscos dentro para o cão rolar para fora.', category: 'toy', difficulty: 'medium', materials: ['uma lata limpa', 'um prego', 'petiscos para cão'], steps: ['Lixe a borda até ficar lisa.', 'Fure alguns buracos ao redor da lata.', 'Coloque petiscos e deixe seu cão rolar para pegá-los.'] },
      { title: 'Brinquedo de Perseguição para Gato', description: 'Coloque um sino dentro de uma lata e sele-a para o gato perseguir e bater.', category: 'toy', difficulty: 'easy', materials: ['uma lata', 'um sino pequeno', 'fita'], steps: ['Coloque um sino pequeno dentro da lata.', 'Cole a abertura firmemente.', 'Role pelo chão para seu gato perseguir.'] },
    ],
  },
  {
    keywords: ['fabric', 'cloth', 'textile', 'clothes', 'jeans', 'shirt', 'tecido', 'roupa', 'camiseta', 'calca', 'calça'],
    daily: [
      { title: 'Sacolas de Tecido para Compras', description: 'Costure tecido velho em sacolas reutilizáveis para substituir plástico na feira.', category: 'daily', difficulty: 'medium', materials: ['tecido velho', 'agulha e linha', 'cordão', 'tesoura'], steps: ['Corte o tecido em retângulos.', 'Dobre e costure as laterais.', 'Passe um cordão pela bainha superior.'] },
      { title: 'Panos de Limpeza de Camiseta', description: 'Corte camisetas velhas em panos de limpeza reutilizáveis — sem papel toalha.', category: 'daily', difficulty: 'easy', materials: ['camisetas velhas', 'tesoura'], steps: ['Estenda a camiseta.', 'Corte em quadrados.', 'Faça bainha nas bordas se quiser durar.'] },
      { title: 'Protetor de Copo de Tecido', description: 'Costure uma tira de tecido velho em uma capa reutilizável para copos de café.', category: 'daily', difficulty: 'easy', materials: ['tecido velho', 'agulha e linha', 'um botão'], steps: ['Corte uma tira de tecido.', 'Costure em um cilindro.', 'Adicione um botão para fechar.'] },
      { title: 'Invólucro de Lanche de Tecido', description: 'Costure tecido em um invólucro reutilizável que dobra em volta de sanduíches ou lanches.', category: 'daily', difficulty: 'medium', materials: ['tecido velho', 'agulha e linha', 'um botão', 'cera de abelha (opcional)'], steps: ['Corte um quadrado de tecido.', 'Faça bainha nas bordas.', 'Adicione uma tira com botão para dobrar e fechar.'] },
    ],
    decoration: [
      { title: 'Tapete de Retalhos', description: 'Trance tiras de tecido velho em um tapete colorido para a cozinha.', category: 'decoration', difficulty: 'hard', materials: ['muitos retalhos de tecido', 'tesoura', 'linha'], steps: ['Corte o tecido em tiras longas.', 'Trance três tiras juntas.', 'Enrole a trança e costure em um tapete.'] },
      { title: 'Tapeçaria de Tecido', description: 'Estique um pedaço bonito de tecido sobre uma moldura para arte de parede instantânea.', category: 'decoration', difficulty: 'easy', materials: ['um pedaço de tecido', 'uma moldura ou vareta', 'grampos ou cola'], steps: ['Passe ferro no tecido.', 'Estique sobre uma moldura.', 'Grampeie ou cole no lugar.'] },
      { title: 'Guirlanda de Bandeirinhas de Tecido', description: 'Corte triângulos de tecido velho e pendure-os em uma bandeirinha festiva.', category: 'decoration', difficulty: 'easy', materials: ['tecido velho', 'tesoura', 'corda ou fita', 'cola'], steps: ['Corte triângulos de tecido.', 'Dobre a borda superior sobre a corda.', 'Cole no lugar e pendure.'] },
      { title: 'Pufe de Retalhos', description: 'Encha tecido velho em uma capa de almofada costurada para fazer um pufe de chão.', category: 'decoration', difficulty: 'hard', materials: ['muitos retalhos de tecido', 'tecido resistente para capa', 'agulha e linha'], steps: ['Costure uma capa grande de almofada.', 'Encha firmemente com retalhos.', 'Costure a abertura fechada.'] },
    ],
    toy: [
      { title: 'Fantoche de Meia', description: 'Transforme uma meia solitária em um fantoche de mão com olhos de botão e cabelo de lã.', category: 'toy', difficulty: 'easy', materials: ['uma meia', 'botões', 'lã', 'cola ou agulha'], steps: ['Coloque a meia na sua mão.', 'Cole botões para olhos e lã para cabelo.', 'Dê um nome e uma voz ao seu fantoche!'] },
      { title: 'Saco de Areia de Tecido', description: 'Costure pequenos quadrados de tecido em saquinhos de areia cheios com arroz seco.', category: 'toy', difficulty: 'medium', materials: ['retalhos de tecido', 'arroz seco', 'agulha e linha'], steps: ['Corte quadrados de tecido.', 'Costure três lados, encha com arroz.', 'Costure o quarto lado e jogue.'] },
      { title: 'Bichinho de Pelúcia', description: 'Corte e costure tecido velho em um simples formato de animal de pelúcia.', category: 'toy', difficulty: 'hard', materials: ['tecido velho', 'agulha e linha', 'enchimento de algodão', 'botões'], steps: ['Desenhe a forma de um animal no tecido.', 'Corte duas peças e costure juntas.', 'Encha e costure, adicione olhos de botão.'] },
      { title: 'Pipa de Tecido', description: 'Estique tecido velho sobre uma estrutura de gravetos para fazer uma pipa simples.', category: 'toy', difficulty: 'hard', materials: ['tecido velho', '2 gravetos', 'corda', 'tesoura', 'fita'], steps: ['Amarre os gravetos em cruz.', 'Corte o tecido para caber e cole.', 'Prende uma corda de rabo e voe.'] },
      { title: 'Brinquedo de Puxar para Cão', description: 'Trance tiras de tecido velho em um brinquedo resistente para cães puxarem.', category: 'toy', difficulty: 'easy', materials: ['tecido velho ou camisetas', 'tesoura'], steps: ['Corte três tiras longas de tecido.', 'Dê um nó numa ponta e trance firmemente.', 'Dê um nó na outra ponta e deixe seu cão puxar.'] },
      { title: 'Mouse de Erva-de-Gato', description: 'Costure um pequeno saquinho de tecido com erva-de-gato dentro para o gato atacar.', category: 'toy', difficulty: 'medium', materials: ['retalhos de tecido', 'agulha e linha', 'erva-de-gato'], steps: ['Corte a forma de um mouse no tecido.', 'Costure duas peças juntas, deixando uma abertura.', 'Encha com erva-de-gato, costure e jogue para seu gato.'] },
    ],
  },
];

const FALLBACK_EN: MaterialEntry = {
  keywords: [],
  daily: [
    { title: 'Upcycled Catch-All Tray', description: 'Flatten and trim your item into a shallow tray for keys, mail, or loose change.', category: 'daily', difficulty: 'easy', materials: ['the item', 'scissors or craft knife', 'glue'], steps: ['Clean the item.', 'Cut or fold it into a tray shape.', 'Reinforce the corners with glue.'] },
    { title: 'Coiled Cord Holder', description: 'Cut strips and coil them into a holder that keeps cables tidy.', category: 'daily', difficulty: 'medium', materials: ['the item', 'scissors', 'glue'], steps: ['Cut long even strips.', 'Coil tightly around a marker.', 'Glue the coil and remove the marker.'] },
    { title: 'Wall Hook', description: 'Bend or cut your item into a hook shape to hang keys or bags by the door.', category: 'daily', difficulty: 'medium', materials: ['the item', 'tools to cut or bend', 'screws or adhesive'], steps: ['Shape the item into a hook.', 'Smooth any sharp edges.', 'Mount on the wall.'] },
    { title: 'Upcycled Bookend', description: 'Stack and glue pieces of your item into a heavy bookend for your shelves.', category: 'daily', difficulty: 'easy', materials: ['the item', 'glue', 'paint (optional)'], steps: ['Cut the item into an L-shape.', 'Glue layers together for weight.', 'Paint if you like and place on a shelf.'] },
  ],
  decoration: [
    { title: 'Painted Statement Piece', description: 'Prime and paint your item in a bold color to use as a shelf centerpiece.', category: 'decoration', difficulty: 'medium', materials: ['the item', 'primer', 'acrylic paint', 'brush'], steps: ['Clean and dry the item.', 'Apply primer.', 'Paint in a bold color and let it dry.'] },
    { title: 'Hanging Mobile', description: 'Cut shapes and suspend them as a balanced hanging mobile.', category: 'decoration', difficulty: 'hard', materials: ['the item', 'thread', 'a stick', 'scissors'], steps: ['Cut lightweight shapes.', 'Tie each to thread at different lengths.', 'Balance on a stick and hang.'] },
    { title: 'Colorful Suncatcher', description: 'Paint or wrap your item in bright colors and hang it where it catches the sun.', category: 'decoration', difficulty: 'easy', materials: ['the item', 'paint or colored film', 'string'], steps: ['Paint or wrap the item in bright colors.', 'Attach a string.', 'Hang it in a sunny window.'] },
    { title: 'Upcycled Wind Chime', description: 'Cut the item into pieces and suspend them so they clink in the wind.', category: 'decoration', difficulty: 'medium', materials: ['the item', 'string', 'a stick or ring', 'scissors'], steps: ['Cut the item into pieces.', 'Tie each piece to string at different lengths.', 'Tie strings to a stick and hang.'] },
  ],
  toy: [
    { title: 'Stacking Tower', description: 'Cut the item into stacking rings of different sizes for a homemade tower toy.', category: 'toy', difficulty: 'medium', materials: ['the item', 'craft knife', 'sandpaper'], steps: ['Cut rings of decreasing size.', 'Sand the edges smooth.', 'Stack and play!'] },
    { title: 'Pull Toy on Wheels', description: 'Attach bottle-cap wheels and a string to make a pull-along toy.', category: 'toy', difficulty: 'hard', materials: ['the item', '4 bottle caps', 'a skewer', 'string'], steps: ['Poke axle holes in the body.', 'Thread bottle-cap wheels on a skewer.', 'Tie a string and pull.'] },
    { title: 'Puzzle Pieces', description: 'Cut the item into puzzle-shaped pieces for a homemade jigsaw.', category: 'toy', difficulty: 'medium', materials: ['the item', 'craft knife', 'a marker'], steps: ['Draw interlocking puzzle shapes.', 'Cut along the lines.', 'Mix up the pieces and solve.'] },
    { title: 'Wind Spinner', description: 'Cut spiral shapes and hang them so they spin in the breeze.', category: 'toy', difficulty: 'easy', materials: ['the item', 'scissors', 'string'], steps: ['Cut a spiral into the item.', 'Attach a string to the center.', 'Hang it where the wind catches it.'] },
  ],
};

const FALLBACK_PT: MaterialEntry = {
  keywords: [],
  daily: [
    { title: 'Bandeja Multiuso Reciclada', description: 'Achate e corte seu item em uma bandeja rasa para chaves, correspondências ou trocos.', category: 'daily', difficulty: 'easy', materials: ['o item', 'tesoura ou estilete', 'cola'], steps: ['Limpe o item.', 'Corte ou dobre em formato de bandeja.', 'Reforce os cantos com cola.'] },
    { title: 'Organizador de Cabos Enrolado', description: 'Corte tiras e enrole-as em um suporte que mantém os cabos organizados.', category: 'daily', difficulty: 'medium', materials: ['o item', 'tesoura', 'cola'], steps: ['Corte tiras longas e uniformes.', 'Enrole firmemente ao redor de um marcador.', 'Cole a espiral e remova o marcador.'] },
    { title: 'Gancho de Parede', description: 'Dobre ou corte seu item em formato de gancho para pendurar chaves ou bolsas pela porta.', category: 'daily', difficulty: 'medium', materials: ['o item', 'ferramentas para cortar ou dobrar', 'parafusos ou adesivo'], steps: ['Molde o item em um gancho.', 'Lixe bordas afiadas.', 'Monte na parede.'] },
    { title: 'Livrante Reciclado', description: 'Empilhe e cole pedaços do seu item em um livrante pesado para suas prateleiras.', category: 'daily', difficulty: 'easy', materials: ['o item', 'cola', 'tinta (opcional)'], steps: ['Corte o item em formato de L.', 'Cole camadas para dar peso.', 'Pinte se quiser e coloque numa prateleira.'] },
  ],
  decoration: [
    { title: 'Peça de Destaque Pintada', description: 'Aplique primer e pinte seu item em uma cor ousada para usar como peça central de prateleira.', category: 'decoration', difficulty: 'medium', materials: ['o item', 'primer', 'tinta acrílica', 'pincel'], steps: ['Limpe e seque o item.', 'Aplique primer.', 'Pinte em uma cor ousada e deixe secar.'] },
    { title: 'Móbile Pendurado', description: 'Corte formas e suspenda-as em um móbile equilibrado.', category: 'decoration', difficulty: 'hard', materials: ['o item', 'linha', 'um graveto', 'tesoura'], steps: ['Corte formas leves.', 'Amarre cada uma em linha de comprimentos diferentes.', 'Equilibre num graveto e pendure.'] },
    { title: 'Captador de Sol Colorido', description: 'Pinte ou enrole seu item em cores vivas e pendure onde pega o sol.', category: 'decoration', difficulty: 'easy', materials: ['o item', 'tinta ou filme colorido', 'corda'], steps: ['Pinte ou enrole o item em cores vivas.', 'Prenda uma corda.', 'Pendure numa janela ensolarada.'] },
    { title: 'Móbile de Vento Reciclado', description: 'Corte o item em pedaços e suspenda-os para tilintar ao vento.', category: 'decoration', difficulty: 'medium', materials: ['o item', 'corda', 'um graveto ou anel', 'tesoura'], steps: ['Corte o item em pedaços.', 'Amarre cada pedaço em corda de comprimentos diferentes.', 'Amarre as cordas num graveto e pendure.'] },
  ],
  toy: [
    { title: 'Torre de Empilhar', description: 'Corte o item em anéis de tamanhos diferentes para um brinquedo de torre caseiro.', category: 'toy', difficulty: 'medium', materials: ['o item', 'estilete', 'lixa'], steps: ['Corte anéis de tamanho decrescente.', 'Lije as bordas até ficarem lisas.', 'Empilhe e brinque!'] },
    { title: 'Brinquedo de Puxar com Rodas', description: 'Prenda rodas de tampas e uma corda para fazer um brinquedo de puxar.', category: 'toy', difficulty: 'hard', materials: ['o item', '4 tampas de garrafa', 'um espeto', 'corda'], steps: ['Fure buracos de eixo no corpo.', 'Encaixe rodas de tampas num espeto.', 'Amarre uma corda e puxe.'] },
    { title: 'Peças de Quebra-Cabeça', description: 'Corte o item em peças com formato de quebra-cabeça para um jigsaw caseiro.', category: 'toy', difficulty: 'medium', materials: ['o item', 'estilete', 'um marcador'], steps: ['Desenhe formas de quebra-cabeça encaixáveis.', 'Corte ao longo das linhas.', 'Misture as peças e resolva.'] },
    { title: 'Espiral de Vento', description: 'Corte formas em espiral e pendure-as para girar na brisa.', category: 'toy', difficulty: 'easy', materials: ['o item', 'tesoura', 'corda'], steps: ['Corte uma espiral no item.', 'Prenda uma corda no centro.', 'Pendure onde o vento pega.'] },
  ],
};

const TWISTS_EN = [
  'Add a splash of color with leftover paint.',
  'Make it modular so you can take it apart later.',
  'Use only materials you already have at home.',
  'Try a version with a hinge or moving part.',
  'Add a handle so it is easy to carry.',
  'Decorate it with natural materials like twigs or leaves.',
  'Make a mini version as a gift.',
  'Add a label so everyone knows what it does.',
  'Try making two and give one to a friend.',
  'Add a hook so it can hang on the wall.',
  'Make it weatherproof for outdoor use.',
  'Add a personal touch with markers or stickers.',
];

const TWISTS_PT = [
  'Adicione um toque de cor com tinta que sobrou.',
  'Faça modular para poder desmontar depois.',
  'Use apenas materiais que você já tem em casa.',
  'Tente uma versão com dobradiça ou peça móvel.',
  'Adicione uma alça para ficar fácil de carregar.',
  'Decore com materiais naturais como galhinhos ou folhas.',
  'Faça uma versão mini para presentear.',
  'Adicione uma etiqueta para todos saberem o que faz.',
  'Tente fazer dois e dê um para um amigo.',
  'Adicione um gancho para pendurar na parede.',
  'Faça à prova de tempo para uso externo.',
  'Adicione um toque pessoal com marcadores ou adesivos.',
];

const ADJECTIVES_EN = ['Mini', 'Giant', 'Colorful', 'Folding', 'Hanging', 'Portable', 'Decorative', 'Magnetic', 'Stackable', 'Vintage'];

const ADJECTIVES_PT = ['Mini', 'Gigante', 'Colorido', 'Dobrável', 'Pendente', 'Portátil', 'Decorativo', 'Magnético', 'Empilhável', 'Vintage'];

const KNOWN_MATERIALS_EN = ['plastic bottle', 'cardboard box', 'glass jar', 'tin can', 'old fabric', 'mixed'];

const KNOWN_MATERIALS_PT = ['garrafa plástica', 'caixa de papelão', 'pote de vidro', 'lata', 'tecido velho', 'misto'];

export const IDEAS_BANK_I18N: Record<LangCode, MaterialEntry[]> = { en, pt };
export const FALLBACK_I18N: Record<LangCode, MaterialEntry> = { en: FALLBACK_EN, pt: FALLBACK_PT };
export const TWISTS_I18N: Record<LangCode, string[]> = { en: TWISTS_EN, pt: TWISTS_PT };
export const ADJECTIVES_I18N: Record<LangCode, string[]> = { en: ADJECTIVES_EN, pt: ADJECTIVES_PT };
export const KNOWN_MATERIALS_I18N: Record<LangCode, string[]> = { en: KNOWN_MATERIALS_EN, pt: KNOWN_MATERIALS_PT };

export function getIdeasBank(lang: LangCode): MaterialEntry[] {
  return IDEAS_BANK_I18N[lang] ?? en;
}

export function getFallback(lang: LangCode): MaterialEntry {
  return FALLBACK_I18N[lang] ?? FALLBACK_EN;
}

export function getTwists(lang: LangCode): string[] {
  return TWISTS_I18N[lang] ?? TWISTS_EN;
}

export function getAdjectives(lang: LangCode): string[] {
  return ADJECTIVES_I18N[lang] ?? ADJECTIVES_EN;
}

export function getKnownMaterials(lang: LangCode): string[] {
  return KNOWN_MATERIALS_I18N[lang] ?? KNOWN_MATERIALS_EN;
}

export function pickEntryLocalized(materialTag: string, lang: LangCode): MaterialEntry {
  const tag = materialTag.toLowerCase();
  const bank = getIdeasBank(lang);
  for (const entry of bank) {
    if (entry.keywords.some((k) => tag.includes(k))) return entry;
  }
  return getFallback(lang);
}
