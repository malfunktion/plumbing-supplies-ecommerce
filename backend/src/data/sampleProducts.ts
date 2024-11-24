interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  sku: string;
  manufacturer: string;
  stockLevel: number;
  images: string[];
  specifications: {
    [key: string]: string | number;
  };
}

const manufacturers = [
  'PlumbMaster',
  'AquaPro',
  'PipeTech',
  'FlowControl',
  'HydroElite',
  'DrainPro',
  'ValveTech',
  'WaterWorks',
];

const categories = {
  'Pipes & Fittings': {
    subcategories: ['PVC Pipes', 'Copper Pipes', 'PEX Pipes', 'Elbows', 'Couplings', 'Tees', 'Adapters'],
    specifications: {
      'Diameter': ['1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"'],
      'Length': ['10ft', '20ft', '50ft', '100ft'],
      'Material': ['PVC', 'Copper', 'PEX', 'Brass', 'Steel'],
      'Pressure Rating': ['Schedule 40', 'Schedule 80'],
    },
  },
  'Valves': {
    subcategories: ['Ball Valves', 'Gate Valves', 'Check Valves', 'Pressure Relief Valves'],
    specifications: {
      'Size': ['1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"'],
      'Material': ['Brass', 'Bronze', 'Stainless Steel', 'PVC'],
      'Pressure Rating': ['150 PSI', '300 PSI', '600 PSI'],
    },
  },
  'Tools': {
    subcategories: ['Pipe Wrenches', 'Pliers', 'Pipe Cutters', 'Threading Tools', 'Drain Snakes'],
    specifications: {
      'Size': ['10"', '14"', '18"', '24"', '36"'],
      'Material': ['Steel', 'Aluminum', 'Cast Iron'],
      'Handle Type': ['Standard', 'Cushion Grip', 'Extended'],
    },
  },
  'Fixtures': {
    subcategories: ['Faucets', 'Sinks', 'Toilets', 'Showerheads', 'Drains'],
    specifications: {
      'Finish': ['Chrome', 'Brushed Nickel', 'Oil Rubbed Bronze', 'Matte Black'],
      'Style': ['Modern', 'Traditional', 'Contemporary', 'Industrial'],
      'Installation Type': ['Wall Mount', 'Deck Mount', 'Floor Mount'],
    },
  },
  'Water Heaters': {
    subcategories: ['Tank Water Heaters', 'Tankless Water Heaters', 'Solar Water Heaters'],
    specifications: {
      'Capacity': ['30 Gallons', '40 Gallons', '50 Gallons', '75 Gallons'],
      'Power Source': ['Electric', 'Gas', 'Solar', 'Hybrid'],
      'Energy Efficiency': ['Standard', 'High Efficiency', 'Ultra Efficient'],
    },
  },
};

function generateSKU(category: string, subcategory: string, index: number): string {
  const cat = category.substring(0, 3).toUpperCase();
  const subcat = subcategory.substring(0, 3).toUpperCase();
  return `${cat}${subcat}${index.toString().padStart(4, '0')}`;
}

function getRandomPrice(category: string): number {
  const ranges = {
    'Pipes & Fittings': { min: 5, max: 100 },
    'Valves': { min: 15, max: 200 },
    'Tools': { min: 20, max: 300 },
    'Fixtures': { min: 50, max: 1000 },
    'Water Heaters': { min: 300, max: 3000 },
  };

  const range = ranges[category as keyof typeof ranges];
  return Number((Math.random() * (range.max - range.min) + range.min).toFixed(2));
}

function getRandomSpecifications(category: string, subcategory: string) {
  const categorySpecs = categories[category as keyof typeof categories].specifications;
  const specs: { [key: string]: string | number } = {};

  Object.entries(categorySpecs).forEach(([key, values]) => {
    specs[key] = Array.isArray(values) 
      ? values[Math.floor(Math.random() * values.length)]
      : values;
  });

  return specs;
}

export function generateSampleProducts(count: number = 200): Product[] {
  const products: Product[] = [];
  let index = 0;

  while (products.length < count) {
    const category = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
    const subcategory = categories[category as keyof typeof categories].subcategories[
      Math.floor(Math.random() * categories[category as keyof typeof categories].subcategories.length)
    ];

    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const specs = getRandomSpecifications(category, subcategory);
    const specsString = Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const product: Product = {
      name: `${manufacturer} ${subcategory} ${specs['Size'] || specs['Capacity'] || ''}`,
      description: `Professional-grade ${subcategory.toLowerCase()} for residential and commercial plumbing applications. Features include ${specsString}. Made by ${manufacturer}, known for quality and reliability.`,
      price: getRandomPrice(category),
      category,
      subcategory,
      sku: generateSKU(category, subcategory, index),
      manufacturer,
      stockLevel: Math.floor(Math.random() * 100) + 1,
      images: [
        `https://placehold.co/400x400?text=${encodeURIComponent(subcategory)}`,
        `https://placehold.co/400x400?text=${encodeURIComponent(manufacturer)}`,
      ],
      specifications: specs,
    };

    products.push(product);
    index++;
  }

  return products;
}

export const sampleProducts = generateSampleProducts();
