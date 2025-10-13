// Datos mock de vehículos argentinos populares
export interface VehicleData {
  marca: string;
  modelos: {
    [modelo: string]: string[];
  };
}

export const vehicleData: VehicleData[] = [
  {
    marca: 'Toyota',
    modelos: {
      'Corolla': ['XLI', 'XEI', 'SEG', 'Hybrid'],
      'Hilux': ['SRV', 'SRX', 'SR5', 'SR5 4x4'],
      'Yaris': ['XLS', 'XLS CVT', 'XLS Hatchback'],
      'RAV4': ['XLE', 'XLE Premium', 'Limited'],
      'Camry': ['LE', 'XLE', 'Hybrid LE']
    }
  },
  {
    marca: 'Volkswagen',
    modelos: {
      'Gol': ['Trend', 'Trendline', 'Comfortline'],
      'Polo': ['Trendline', 'Comfortline', 'Highline'],
      'Vento': ['Trendline', 'Comfortline', 'Highline'],
      'T-Cross': ['Trendline', 'Comfortline', 'Highline'],
      'Amarok': ['Trendline', 'Comfortline', 'Highline']
    }
  },
  {
    marca: 'Ford',
    modelos: {
      'Focus': ['SE', 'Titanium', 'ST-Line'],
      'Ranger': ['XL', 'XLS', 'XLT', 'Wildtrak'],
      'Ka': ['SE', 'Titanium'],
      'EcoSport': ['SE', 'Titanium', 'ST-Line'],
      'Territory': ['Titanium', 'ST-Line']
    }
  },
  {
    marca: 'Chevrolet',
    modelos: {
      'Onix': ['LS', 'LT', 'LTZ'],
      'Cruze': ['LS', 'LT', 'LTZ'],
      'Tracker': ['LS', 'LT', 'LTZ'],
      'S10': ['LS', 'LT', 'LTZ'],
      'Spin': ['LS', 'LT', 'LTZ']
    }
  },
  {
    marca: 'Fiat',
    modelos: {
      'Cronos': ['Drive', 'Precision', 'Precision CVT'],
      'Argo': ['Drive', 'Precision', 'Precision CVT'],
      'Mobi': ['Drive', 'Precision'],
      'Toro': ['Freedom', 'Volcano', 'Volcano 4x4'],
      'Strada': ['Working', 'Freedom', 'Volcano']
    }
  },
  {
    marca: 'Renault',
    modelos: {
      'Kwid': ['Zen', 'Intense', 'Intense CVT'],
      'Logan': ['Zen', 'Intense', 'Intense CVT'],
      'Sandero': ['Zen', 'Intense', 'Intense CVT'],
      'Duster': ['Zen', 'Intense', 'Intense 4x4'],
      'Oroch': ['Zen', 'Intense', 'Intense 4x4']
    }
  },
  {
    marca: 'Peugeot',
    modelos: {
      '208': ['Active', 'Allure', 'GT'],
      '308': ['Active', 'Allure', 'GT'],
      '2008': ['Active', 'Allure', 'GT'],
      '3008': ['Active', 'Allure', 'GT'],
      'Partner': ['Active', 'Allure']
    }
  },
  {
    marca: 'Nissan',
    modelos: {
      'Versa': ['Advance', 'Exclusive', 'Exclusive CVT'],
      'March': ['Advance', 'Exclusive'],
      'Kicks': ['Advance', 'Exclusive', 'Exclusive CVT'],
      'Frontier': ['Advance', 'Exclusive', 'Exclusive 4x4'],
      'Sentra': ['Advance', 'Exclusive', 'Exclusive CVT']
    }
  }
];

export const getMarcas = (): string[] => {
  return vehicleData.map(v => v.marca);
};

export const getModelos = (marca: string): string[] => {
  const vehicle = vehicleData.find(v => v.marca === marca);
  return vehicle ? Object.keys(vehicle.modelos) : [];
};

export const getVersiones = (marca: string, modelo: string): string[] => {
  const vehicle = vehicleData.find(v => v.marca === marca);
  return vehicle?.modelos[modelo] || [];
};

// Función para parsear datos del CRM y extraer información del vehículo
export interface CRMVehicleInfo {
  marca?: string;
  modelo?: string;
  version?: string;
  sku?: string;
  precio?: number;
  dealId?: string;
}

export const parseCRMVehicleData = (crmData: any): CRMVehicleInfo => {
  try {
    const productName = crmData?.sales_order?.product?.name || '';
    const sku = crmData?.sales_order?.product?.sku || '';
    const precio = parseFloat(crmData?.sales_order?.initial_value || '0');
    const dealId = crmData?.deal_id || '';
    
    // Intentar extraer marca y modelo del nombre del producto
    let marca = '';
    let modelo = '';
    let version = '';
    
    // Buscar marca en el nombre del producto
    for (const vehicle of vehicleData) {
      if (productName.toLowerCase().includes(vehicle.marca.toLowerCase())) {
        marca = vehicle.marca;
        break;
      }
    }
    
    // Si encontramos marca, buscar modelo
    if (marca) {
      const vehicle = vehicleData.find(v => v.marca === marca);
      if (vehicle) {
        for (const [modeloName, versiones] of Object.entries(vehicle.modelos)) {
          if (productName.toLowerCase().includes(modeloName.toLowerCase())) {
            modelo = modeloName;
            // Buscar versión
            for (const versionName of versiones) {
              if (productName.toLowerCase().includes(versionName.toLowerCase())) {
                version = versionName;
                break;
              }
            }
            break;
          }
        }
      }
    }
    
    return {
      marca,
      modelo,
      version,
      sku,
      precio,
      dealId
    };
  } catch (error) {
    console.error('Error parsing CRM vehicle data:', error);
    return {};
  }
};






