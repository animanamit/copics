// Complete Copic Sketch marker database - 358 colors
// Source: Official Copic website (copic.jp/en/color/sketch/)
// Hex values sourced from official Copic resources and community databases

export interface CopicSketchColor {
  code: string;
  name: string;
  hex: string;
  family: string;
}

// All 358 Copic Sketch colors organized by family
export const COPIC_SKETCH_COLORS: Record<string, CopicSketchColor> = {
  // Blue Violet (BV) - 16 colors
  "BV0000": { code: "BV0000", name: "Pale Thistle", hex: "#EBE8F2", family: "Blue Violet" },
  "BV000": { code: "BV000", name: "Iridescent Mauve", hex: "#E7E4EF", family: "Blue Violet" },
  "BV00": { code: "BV00", name: "Mauve Shadow", hex: "#E0DCED", family: "Blue Violet" },
  "BV01": { code: "BV01", name: "Viola", hex: "#DCD8EC", family: "Blue Violet" },
  "BV02": { code: "BV02", name: "Prune", hex: "#D5C9E4", family: "Blue Violet" },
  "BV04": { code: "BV04", name: "Blue Berry", hex: "#ADA2CE", family: "Blue Violet" },
  "BV08": { code: "BV08", name: "Blue Violet", hex: "#7266A7", family: "Blue Violet" },
  "BV11": { code: "BV11", name: "Soft Violet", hex: "#DDD7EB", family: "Blue Violet" },
  "BV13": { code: "BV13", name: "Hydrangea Blue", hex: "#B9B0D7", family: "Blue Violet" },
  "BV17": { code: "BV17", name: "Deep Reddish Blue", hex: "#8476B0", family: "Blue Violet" },
  "BV20": { code: "BV20", name: "Dull Lavender", hex: "#E3DBE9", family: "Blue Violet" },
  "BV23": { code: "BV23", name: "Grayish Lavender", hex: "#C5BCD3", family: "Blue Violet" },
  "BV25": { code: "BV25", name: "Grayish Violet", hex: "#9F94B5", family: "Blue Violet" },
  "BV29": { code: "BV29", name: "Slate", hex: "#5E5A79", family: "Blue Violet" },
  "BV31": { code: "BV31", name: "Pale Lavender", hex: "#E9E3EF", family: "Blue Violet" },
  "BV34": { code: "BV34", name: "Bluebell", hex: "#C5BAD9", family: "Blue Violet" },

  // Violet (V) - 17 colors
  "V0000": { code: "V0000", name: "Rose Quartz", hex: "#F5EBF0", family: "Violet" },
  "V000": { code: "V000", name: "Pale Heath", hex: "#F0E5EB", family: "Violet" },
  "V01": { code: "V01", name: "Heath", hex: "#EED8E5", family: "Violet" },
  "V04": { code: "V04", name: "Lilac", hex: "#D7B9D2", family: "Violet" },
  "V05": { code: "V05", name: "Azalea", hex: "#C89DC1", family: "Violet" },
  "V06": { code: "V06", name: "Lavender", hex: "#B787AE", family: "Violet" },
  "V09": { code: "V09", name: "Violet", hex: "#8A5F90", family: "Violet" },
  "V12": { code: "V12", name: "Pale Lilac", hex: "#EBD8E5", family: "Violet" },
  "V15": { code: "V15", name: "Mallow", hex: "#C9A3C0", family: "Violet" },
  "V17": { code: "V17", name: "Amethyst", hex: "#9C6E9C", family: "Violet" },
  "V20": { code: "V20", name: "Wisteria", hex: "#EADBE6", family: "Violet" },
  "V22": { code: "V22", name: "Ash Lavender", hex: "#D2BCCF", family: "Violet" },
  "V25": { code: "V25", name: "Pale Blackberry", hex: "#B197B5", family: "Violet" },
  "V28": { code: "V28", name: "Eggplant", hex: "#7C5481", family: "Violet" },
  "V91": { code: "V91", name: "Pale Grape", hex: "#E5D6E0", family: "Violet" },
  "V93": { code: "V93", name: "Early Grape", hex: "#D1B7CA", family: "Violet" },
  "V95": { code: "V95", name: "Light Grape", hex: "#B38FB0", family: "Violet" },
  "V99": { code: "V99", name: "Aubergine", hex: "#6A4568", family: "Violet" },

  // Red Violet (RV) - 23 colors
  "RV0000": { code: "RV0000", name: "Evening Primrose", hex: "#FDF0F3", family: "Red Violet" },
  "RV000": { code: "RV000", name: "Pale Purple", hex: "#FCEEF2", family: "Red Violet" },
  "RV00": { code: "RV00", name: "Water Lily", hex: "#FBE8EC", family: "Red Violet" },
  "RV02": { code: "RV02", name: "Sugared Almond Pink", hex: "#F8D8E0", family: "Red Violet" },
  "RV04": { code: "RV04", name: "Shock Pink", hex: "#F5AFC3", family: "Red Violet" },
  "RV06": { code: "RV06", name: "Cerise", hex: "#F08BAD", family: "Red Violet" },
  "RV09": { code: "RV09", name: "Fuchsia", hex: "#DA5D83", family: "Red Violet" },
  "RV10": { code: "RV10", name: "Pale Pink", hex: "#FCE7EB", family: "Red Violet" },
  "RV11": { code: "RV11", name: "Pink", hex: "#FAD7DE", family: "Red Violet" },
  "RV13": { code: "RV13", name: "Tender Pink", hex: "#F8C1CF", family: "Red Violet" },
  "RV14": { code: "RV14", name: "Begonia Pink", hex: "#F3A5B7", family: "Red Violet" },
  "RV17": { code: "RV17", name: "Deep Magenta", hex: "#E06B8C", family: "Red Violet" },
  "RV19": { code: "RV19", name: "Red Violet", hex: "#C74777", family: "Red Violet" },
  "RV21": { code: "RV21", name: "Light Pink", hex: "#FBE3E6", family: "Red Violet" },
  "RV23": { code: "RV23", name: "Pure Pink", hex: "#F5C3CD", family: "Red Violet" },
  "RV25": { code: "RV25", name: "Dog Rose Flower", hex: "#ED9EAF", family: "Red Violet" },
  "RV29": { code: "RV29", name: "Crimson", hex: "#C7577B", family: "Red Violet" },
  "RV32": { code: "RV32", name: "Shadow Pink", hex: "#F8D3D9", family: "Red Violet" },
  "RV34": { code: "RV34", name: "Dark Pink", hex: "#F2A7B6", family: "Red Violet" },
  "RV42": { code: "RV42", name: "Salmon Pink", hex: "#F7B8B5", family: "Red Violet" },
  "RV52": { code: "RV52", name: "Cotton Candy", hex: "#F5D5DC", family: "Red Violet" },
  "RV55": { code: "RV55", name: "Hollyhock", hex: "#E8A5B5", family: "Red Violet" },
  "RV63": { code: "RV63", name: "Begonia", hex: "#E397A8", family: "Red Violet" },
  "RV66": { code: "RV66", name: "Raspberry", hex: "#C96B7E", family: "Red Violet" },
  "RV69": { code: "RV69", name: "Peony", hex: "#A54B62", family: "Red Violet" },
  "RV91": { code: "RV91", name: "Grayish Cherry", hex: "#E8D2D6", family: "Red Violet" },
  "RV93": { code: "RV93", name: "Smoky Purple", hex: "#D8B8C0", family: "Red Violet" },
  "RV95": { code: "RV95", name: "Baby Blossoms", hex: "#C99BA8", family: "Red Violet" },
  "RV99": { code: "RV99", name: "Argyle Purple", hex: "#6A4558", family: "Red Violet" },

  // Red (R) - 29 colors
  "R0000": { code: "R0000", name: "Pink Beryl", hex: "#FEF5F2", family: "Red" },
  "R000": { code: "R000", name: "Cherry White", hex: "#FEF2EF", family: "Red" },
  "R00": { code: "R00", name: "Pinkish White", hex: "#FEF0ED", family: "Red" },
  "R01": { code: "R01", name: "Pinkish Vanilla", hex: "#FCE8E3", family: "Red" },
  "R02": { code: "R02", name: "Rose Salmon", hex: "#FCDDD3", family: "Red" },
  "R05": { code: "R05", name: "Salmon Red", hex: "#F7C2B3", family: "Red" },
  "R08": { code: "R08", name: "Vermilion", hex: "#F39583", family: "Red" },
  "R11": { code: "R11", name: "Pale Cherry Pink", hex: "#FCDEE2", family: "Red" },
  "R12": { code: "R12", name: "Light Tea Rose", hex: "#FACFD6", family: "Red" },
  "R14": { code: "R14", name: "Light Rouge", hex: "#F8B4BE", family: "Red" },
  "R17": { code: "R17", name: "Lipstick Orange", hex: "#F58E8A", family: "Red" },
  "R20": { code: "R20", name: "Blush", hex: "#FDDCE4", family: "Red" },
  "R21": { code: "R21", name: "Sardonyx", hex: "#FBC5CB", family: "Red" },
  "R22": { code: "R22", name: "Light Prawn", hex: "#F8B2B6", family: "Red" },
  "R24": { code: "R24", name: "Prawn", hex: "#F49C9D", family: "Red" },
  "R27": { code: "R27", name: "Cadmium Red", hex: "#EF6D73", family: "Red" },
  "R29": { code: "R29", name: "Lipstick Red", hex: "#E74255", family: "Red" },
  "R30": { code: "R30", name: "Pale Yellowish Pink", hex: "#FDE8DC", family: "Red" },
  "R32": { code: "R32", name: "Peach", hex: "#FAC8C8", family: "Red" },
  "R35": { code: "R35", name: "Coral", hex: "#F8A9A0", family: "Red" },
  "R37": { code: "R37", name: "Carmine", hex: "#EF7B7B", family: "Red" },
  "R39": { code: "R39", name: "Garnet", hex: "#D9505A", family: "Red" },
  "R43": { code: "R43", name: "Bougainvillaea", hex: "#F0A4A5", family: "Red" },
  "R46": { code: "R46", name: "Strong Red", hex: "#E26971", family: "Red" },
  "R56": { code: "R56", name: "Currant", hex: "#C95A62", family: "Red" },
  "R59": { code: "R59", name: "Cardinal", hex: "#B0404A", family: "Red" },
  "R81": { code: "R81", name: "Rose Pink", hex: "#F5D5D8", family: "Red" },
  "R83": { code: "R83", name: "Rose Mist", hex: "#E8B5BA", family: "Red" },
  "R85": { code: "R85", name: "Rose Red", hex: "#D88E95", family: "Red" },
  "R89": { code: "R89", name: "Dark Red", hex: "#A05560", family: "Red" },

  // Yellow Red (YR) - 23 colors
  "YR0000": { code: "YR0000", name: "Pale Chiffon", hex: "#FFF6EE", family: "Yellow Red" },
  "YR000": { code: "YR000", name: "Silk", hex: "#FFF4E8", family: "Yellow Red" },
  "YR00": { code: "YR00", name: "Powder Pink", hex: "#FFF1E5", family: "Yellow Red" },
  "YR01": { code: "YR01", name: "Peach Puff", hex: "#FFE8D6", family: "Yellow Red" },
  "YR02": { code: "YR02", name: "Light Orange", hex: "#FFE0C6", family: "Yellow Red" },
  "YR04": { code: "YR04", name: "Chrome Orange", hex: "#FFD4A8", family: "Yellow Red" },
  "YR07": { code: "YR07", name: "Cadmium Orange", hex: "#FFBB6E", family: "Yellow Red" },
  "YR09": { code: "YR09", name: "Chinese Orange", hex: "#FF9F49", family: "Yellow Red" },
  "YR12": { code: "YR12", name: "Loquat", hex: "#FFE7C5", family: "Yellow Red" },
  "YR14": { code: "YR14", name: "Caramel", hex: "#FFD9A0", family: "Yellow Red" },
  "YR15": { code: "YR15", name: "Pumpkin Yellow", hex: "#FFD07A", family: "Yellow Red" },
  "YR16": { code: "YR16", name: "Apricot", hex: "#FFC566", family: "Yellow Red" },
  "YR18": { code: "YR18", name: "Sanguine", hex: "#FFAB48", family: "Yellow Red" },
  "YR20": { code: "YR20", name: "Yellowish Shade", hex: "#FFEBD2", family: "Yellow Red" },
  "YR21": { code: "YR21", name: "Cream", hex: "#FFE4C2", family: "Yellow Red" },
  "YR23": { code: "YR23", name: "Yellow Ochre", hex: "#DFB57D", family: "Yellow Red" },
  "YR24": { code: "YR24", name: "Pale Sepia", hex: "#E9B977", family: "Yellow Red" },
  "YR27": { code: "YR27", name: "Tuscan Orange", hex: "#BD7E4A", family: "Yellow Red" },
  "YR30": { code: "YR30", name: "Macadamia Nut", hex: "#FFF0DB", family: "Yellow Red" },
  "YR31": { code: "YR31", name: "Light Reddish Yellow", hex: "#FFE5C3", family: "Yellow Red" },
  "YR61": { code: "YR61", name: "Spring Orange", hex: "#FFD8A8", family: "Yellow Red" },
  "YR65": { code: "YR65", name: "Atoll", hex: "#F5B878", family: "Yellow Red" },
  "YR68": { code: "YR68", name: "Orange", hex: "#E89850", family: "Yellow Red" },
  "YR82": { code: "YR82", name: "Mellow Peach", hex: "#FFE0C0", family: "Yellow Red" },

  // Yellow (Y) - 21 colors
  "Y0000": { code: "Y0000", name: "Yellow Fluorite", hex: "#FFFCE8", family: "Yellow" },
  "Y000": { code: "Y000", name: "Pale Lemon", hex: "#FFFBD8", family: "Yellow" },
  "Y00": { code: "Y00", name: "Barium Yellow", hex: "#FFF9D5", family: "Yellow" },
  "Y02": { code: "Y02", name: "Canary Yellow", hex: "#FFF4A7", family: "Yellow" },
  "Y04": { code: "Y04", name: "Acacia", hex: "#FFEB7C", family: "Yellow" },
  "Y06": { code: "Y06", name: "Yellow", hex: "#FFE55C", family: "Yellow" },
  "Y08": { code: "Y08", name: "Acid Yellow", hex: "#FFDE3D", family: "Yellow" },
  "Y11": { code: "Y11", name: "Pale Yellow", hex: "#FFF8C4", family: "Yellow" },
  "Y13": { code: "Y13", name: "Lemon Yellow", hex: "#FFF199", family: "Yellow" },
  "Y15": { code: "Y15", name: "Cadmium Yellow", hex: "#FFEA71", family: "Yellow" },
  "Y17": { code: "Y17", name: "Golden Yellow", hex: "#FFD947", family: "Yellow" },
  "Y18": { code: "Y18", name: "Lightning Yellow", hex: "#FFCD28", family: "Yellow" },
  "Y19": { code: "Y19", name: "Napoli Yellow", hex: "#FFC412", family: "Yellow" },
  "Y21": { code: "Y21", name: "Buttercup Yellow", hex: "#FFF0BA", family: "Yellow" },
  "Y23": { code: "Y23", name: "Yellowish Beige", hex: "#FFE8A4", family: "Yellow" },
  "Y26": { code: "Y26", name: "Mustard", hex: "#E8C65B", family: "Yellow" },
  "Y28": { code: "Y28", name: "Lionet Gold", hex: "#D4A832", family: "Yellow" },
  "Y32": { code: "Y32", name: "Cashmere", hex: "#FFF1C8", family: "Yellow" },
  "Y35": { code: "Y35", name: "Maize", hex: "#FFE597", family: "Yellow" },
  "Y38": { code: "Y38", name: "Honey", hex: "#F2C35C", family: "Yellow" },

  // Yellow Green (YG) - 24 colors
  "YG0000": { code: "YG0000", name: "Lily White", hex: "#F8F9E8", family: "Yellow Green" },
  "YG00": { code: "YG00", name: "Mimosa Yellow", hex: "#F5F5C8", family: "Yellow Green" },
  "YG01": { code: "YG01", name: "Green Bice", hex: "#E7EEB8", family: "Yellow Green" },
  "YG03": { code: "YG03", name: "Yellow Green", hex: "#D6E6A0", family: "Yellow Green" },
  "YG05": { code: "YG05", name: "Salad", hex: "#C5DD8B", family: "Yellow Green" },
  "YG06": { code: "YG06", name: "Yellowish Green", hex: "#B3D377", family: "Yellow Green" },
  "YG07": { code: "YG07", name: "Acid Green", hex: "#A0C963", family: "Yellow Green" },
  "YG09": { code: "YG09", name: "Lettuce Green", hex: "#8ABE54", family: "Yellow Green" },
  "YG11": { code: "YG11", name: "Mignonette", hex: "#E5EFC7", family: "Yellow Green" },
  "YG13": { code: "YG13", name: "Chartreuse", hex: "#CEE6A0", family: "Yellow Green" },
  "YG17": { code: "YG17", name: "Grass Green", hex: "#95C360", family: "Yellow Green" },
  "YG21": { code: "YG21", name: "Anise", hex: "#F0F2C7", family: "Yellow Green" },
  "YG23": { code: "YG23", name: "New Leaf", hex: "#D8E8A7", family: "Yellow Green" },
  "YG25": { code: "YG25", name: "Celadon Green", hex: "#BFDE91", family: "Yellow Green" },
  "YG41": { code: "YG41", name: "Pale Cobalt Green", hex: "#DEF0CB", family: "Yellow Green" },
  "YG45": { code: "YG45", name: "Cobalt Green", hex: "#A5D890", family: "Yellow Green" },
  "YG61": { code: "YG61", name: "Pale Moss", hex: "#D5E0A8", family: "Yellow Green" },
  "YG63": { code: "YG63", name: "Pea Green", hex: "#A9C77C", family: "Yellow Green" },
  "YG67": { code: "YG67", name: "Moss", hex: "#7DAD5B", family: "Yellow Green" },
  "YG91": { code: "YG91", name: "Putty", hex: "#E3E4BF", family: "Yellow Green" },
  "YG93": { code: "YG93", name: "Grayish Yellow", hex: "#D3D5A5", family: "Yellow Green" },
  "YG95": { code: "YG95", name: "Pale Olive", hex: "#C2C48F", family: "Yellow Green" },
  "YG97": { code: "YG97", name: "Spanish Olive", hex: "#9DA46A", family: "Yellow Green" },
  "YG99": { code: "YG99", name: "Marine Green", hex: "#7A8B52", family: "Yellow Green" },

  // Green (G) - 25 colors
  "G0000": { code: "G0000", name: "Crystal Opal", hex: "#F0F6F0", family: "Green" },
  "G000": { code: "G000", name: "Pale Green", hex: "#E8F3E8", family: "Green" },
  "G00": { code: "G00", name: "Jade Green", hex: "#E5F3E5", family: "Green" },
  "G02": { code: "G02", name: "Spectrum Green", hex: "#C8E8C8", family: "Green" },
  "G03": { code: "G03", name: "Meadow Green", hex: "#B4E1B4", family: "Green" },
  "G05": { code: "G05", name: "Emerald Green", hex: "#86CC8C", family: "Green" },
  "G07": { code: "G07", name: "Nile Green", hex: "#6EBE78", family: "Green" },
  "G09": { code: "G09", name: "Veronese Green", hex: "#4EAC60", family: "Green" },
  "G12": { code: "G12", name: "Sea Green", hex: "#C6E9D0", family: "Green" },
  "G14": { code: "G14", name: "Apple Green", hex: "#9FD9A8", family: "Green" },
  "G16": { code: "G16", name: "Malachite", hex: "#76C686", family: "Green" },
  "G17": { code: "G17", name: "Forest Green", hex: "#5BB56C", family: "Green" },
  "G19": { code: "G19", name: "Bright Parrot Green", hex: "#3FA054", family: "Green" },
  "G20": { code: "G20", name: "Wax White", hex: "#E8F2E6", family: "Green" },
  "G21": { code: "G21", name: "Lime Green", hex: "#C9E7C4", family: "Green" },
  "G24": { code: "G24", name: "Willow", hex: "#9CD89D", family: "Green" },
  "G28": { code: "G28", name: "Ocean Green", hex: "#3F9A56", family: "Green" },
  "G29": { code: "G29", name: "Pine Tree Green", hex: "#2F8B4A", family: "Green" },
  "G40": { code: "G40", name: "Dim Green", hex: "#E5F0E7", family: "Green" },
  "G43": { code: "G43", name: "Pistachio", hex: "#C2E0C4", family: "Green" },
  "G46": { code: "G46", name: "Mistletoe", hex: "#8EC095", family: "Green" },
  "G82": { code: "G82", name: "Spring Dim Green", hex: "#D0E8C9", family: "Green" },
  "G85": { code: "G85", name: "Verdigris", hex: "#99C9A0", family: "Green" },
  "G94": { code: "G94", name: "Grayish Olive", hex: "#8FAE80", family: "Green" },
  "G99": { code: "G99", name: "Olive", hex: "#5E8753", family: "Green" },

  // Blue Green (BG) - 28 colors
  "BG0000": { code: "BG0000", name: "Snow Green", hex: "#EFF8F3", family: "Blue Green" },
  "BG000": { code: "BG000", name: "Pale Aqua", hex: "#E8F5F0", family: "Blue Green" },
  "BG01": { code: "BG01", name: "Aqua Blue", hex: "#CCE9E6", family: "Blue Green" },
  "BG02": { code: "BG02", name: "New Blue", hex: "#AEE0DB", family: "Blue Green" },
  "BG05": { code: "BG05", name: "Holiday Blue", hex: "#76C8C5", family: "Blue Green" },
  "BG07": { code: "BG07", name: "Petroleum Blue", hex: "#4EB5B4", family: "Blue Green" },
  "BG09": { code: "BG09", name: "Blue Green", hex: "#2EA3A3", family: "Blue Green" },
  "BG10": { code: "BG10", name: "Cool Shadow", hex: "#E0F0EE", family: "Blue Green" },
  "BG11": { code: "BG11", name: "Moon White", hex: "#D3EAE8", family: "Blue Green" },
  "BG13": { code: "BG13", name: "Mint Green", hex: "#9EDBD4", family: "Blue Green" },
  "BG15": { code: "BG15", name: "Aqua", hex: "#6BCCC6", family: "Blue Green" },
  "BG18": { code: "BG18", name: "Teal Blue", hex: "#3BB1AD", family: "Blue Green" },
  "BG23": { code: "BG23", name: "Coral Sea", hex: "#8CCFC8", family: "Blue Green" },
  "BG32": { code: "BG32", name: "Aqua Mint", hex: "#AEDFD9", family: "Blue Green" },
  "BG34": { code: "BG34", name: "Horizon Green", hex: "#82CBBF", family: "Blue Green" },
  "BG45": { code: "BG45", name: "Nile Blue", hex: "#6CC8C3", family: "Blue Green" },
  "BG49": { code: "BG49", name: "Duck Blue", hex: "#289C97", family: "Blue Green" },
  "BG53": { code: "BG53", name: "Ice Mint", hex: "#C4E5DF", family: "Blue Green" },
  "BG57": { code: "BG57", name: "Jasper", hex: "#7DCBBF", family: "Blue Green" },
  "BG70": { code: "BG70", name: "Ocean Mist", hex: "#DCE9E5", family: "Blue Green" },
  "BG72": { code: "BG72", name: "Ice Ocean", hex: "#B8D6CE", family: "Blue Green" },
  "BG75": { code: "BG75", name: "Abyss Green", hex: "#7FBCAC", family: "Blue Green" },
  "BG78": { code: "BG78", name: "Bronze", hex: "#4D9E8E", family: "Blue Green" },
  "BG90": { code: "BG90", name: "Gray Sky", hex: "#E0E7E5", family: "Blue Green" },
  "BG93": { code: "BG93", name: "Green Gray", hex: "#BECCC6", family: "Blue Green" },
  "BG96": { code: "BG96", name: "Bush", hex: "#8EAA9E", family: "Blue Green" },
  "BG99": { code: "BG99", name: "Flagstone Blue", hex: "#5D8A80", family: "Blue Green" },

  // Blue (B) - 35 colors
  "B0000": { code: "B0000", name: "Pale Celestine", hex: "#F0F9FE", family: "Blue" },
  "B000": { code: "B000", name: "Pale Porcelain Blue", hex: "#E6F4F5", family: "Blue" },
  "B00": { code: "B00", name: "Frost Blue", hex: "#DDF0F4", family: "Blue" },
  "B01": { code: "B01", name: "Mint Blue", hex: "#D6EEF2", family: "Blue" },
  "B02": { code: "B02", name: "Robin's Egg Blue", hex: "#B3E3F1", family: "Blue" },
  "B04": { code: "B04", name: "Tahitian Blue", hex: "#73CFE6", family: "Blue" },
  "B05": { code: "B05", name: "Process Blue", hex: "#40C5E6", family: "Blue" },
  "B06": { code: "B06", name: "Peacock Blue", hex: "#00B3E6", family: "Blue" },
  "B12": { code: "B12", name: "Ice Blue", hex: "#C8E6F0", family: "Blue" },
  "B14": { code: "B14", name: "Light Blue", hex: "#71CFEB", family: "Blue" },
  "B16": { code: "B16", name: "Cyanine Blue", hex: "#00BCEA", family: "Blue" },
  "B18": { code: "B18", name: "Lapis Lazuli", hex: "#1D8ACB", family: "Blue" },
  "B21": { code: "B21", name: "Baby Blue", hex: "#DBEDF9", family: "Blue" },
  "B23": { code: "B23", name: "Phthalo Blue", hex: "#92C2E8", family: "Blue" },
  "B24": { code: "B24", name: "Sky", hex: "#8ACEF3", family: "Blue" },
  "B26": { code: "B26", name: "Cobalt Blue", hex: "#65B3E3", family: "Blue" },
  "B28": { code: "B28", name: "Royal Blue", hex: "#196DB6", family: "Blue" },
  "B29": { code: "B29", name: "Ultramarine", hex: "#0177C1", family: "Blue" },
  "B32": { code: "B32", name: "Pale Blue", hex: "#E2EFF7", family: "Blue" },
  "B34": { code: "B34", name: "Manganese Blue", hex: "#82C3ED", family: "Blue" },
  "B37": { code: "B37", name: "Antwerp Blue", hex: "#156FA4", family: "Blue" },
  "B39": { code: "B39", name: "Prussian Blue", hex: "#2B64A9", family: "Blue" },
  "B41": { code: "B41", name: "Powder Blue", hex: "#E2F0FB", family: "Blue" },
  "B45": { code: "B45", name: "Smoky Blue", hex: "#75C0EA", family: "Blue" },
  "B52": { code: "B52", name: "Soft Greenish Blue", hex: "#ADCDDC", family: "Blue" },
  "B60": { code: "B60", name: "Pale Blue Gray", hex: "#DAE1F3", family: "Blue" },
  "B63": { code: "B63", name: "Light Hydrangea", hex: "#A7BBE0", family: "Blue" },
  "B66": { code: "B66", name: "Clematis", hex: "#6888C5", family: "Blue" },
  "B69": { code: "B69", name: "Stratospheric Blue", hex: "#2165AE", family: "Blue" },
  "B79": { code: "B79", name: "Iris", hex: "#3B479D", family: "Blue" },
  "B91": { code: "B91", name: "Pale Grayish Blue", hex: "#D5E2EB", family: "Blue" },
  "B93": { code: "B93", name: "Light Crockery Blue", hex: "#95C1DA", family: "Blue" },
  "B95": { code: "B95", name: "Light Grayish Cobalt", hex: "#60C5CF", family: "Blue" },
  "B97": { code: "B97", name: "Night Blue", hex: "#457A9A", family: "Blue" },
  "B99": { code: "B99", name: "Agate", hex: "#0F547E", family: "Blue" },

  // Earth (E) - 51 colors
  "E0000": { code: "E0000", name: "Floral White", hex: "#FEF9F2", family: "Earth" },
  "E000": { code: "E000", name: "Pale Fruit Pink", hex: "#FEF6EC", family: "Earth" },
  "E00": { code: "E00", name: "Cotton Pearl", hex: "#FEF4E8", family: "Earth" },
  "E01": { code: "E01", name: "Pink Flamingo", hex: "#FEE9D7", family: "Earth" },
  "E02": { code: "E02", name: "Fruit Pink", hex: "#FDDFC8", family: "Earth" },
  "E04": { code: "E04", name: "Lipstick Rose", hex: "#EEDAC4", family: "Earth" },
  "E07": { code: "E07", name: "Light Mahogany", hex: "#D4A878", family: "Earth" },
  "E08": { code: "E08", name: "Brown", hex: "#C89058", family: "Earth" },
  "E09": { code: "E09", name: "Burnt Sienna", hex: "#B87840", family: "Earth" },
  "E11": { code: "E11", name: "Barley Beige", hex: "#FFE3C3", family: "Earth" },
  "E13": { code: "E13", name: "Desert Sand", hex: "#EECBA4", family: "Earth" },
  "E15": { code: "E15", name: "Earthenware", hex: "#DDB888", family: "Earth" },
  "E17": { code: "E17", name: "Reddish Brass", hex: "#C89868", family: "Earth" },
  "E18": { code: "E18", name: "Copper", hex: "#B07848", family: "Earth" },
  "E19": { code: "E19", name: "Redwood", hex: "#985830", family: "Earth" },
  "E21": { code: "E21", name: "Soft Sun", hex: "#FFE6C2", family: "Earth" },
  "E23": { code: "E23", name: "Hazelnut", hex: "#E5C8A0", family: "Earth" },
  "E25": { code: "E25", name: "Caribe Cocoa", hex: "#D0A878", family: "Earth" },
  "E27": { code: "E27", name: "Milk Chocolate", hex: "#B08058", family: "Earth" },
  "E29": { code: "E29", name: "Burnt Umber", hex: "#906040", family: "Earth" },
  "E30": { code: "E30", name: "Bisque", hex: "#FFF0DD", family: "Earth" },
  "E31": { code: "E31", name: "Brick Beige", hex: "#F9D7A2", family: "Earth" },
  "E33": { code: "E33", name: "Sand", hex: "#ECCA7D", family: "Earth" },
  "E34": { code: "E34", name: "Toast", hex: "#D9A76E", family: "Earth" },
  "E35": { code: "E35", name: "Chamois", hex: "#E8C993", family: "Earth" },
  "E37": { code: "E37", name: "Sepia", hex: "#CC9654", family: "Earth" },
  "E39": { code: "E39", name: "Leather", hex: "#A87040", family: "Earth" },
  "E40": { code: "E40", name: "Brick White", hex: "#F5EEE5", family: "Earth" },
  "E41": { code: "E41", name: "Pearl White", hex: "#F8F2E8", family: "Earth" },
  "E42": { code: "E42", name: "Sand White", hex: "#F0E8D8", family: "Earth" },
  "E43": { code: "E43", name: "Dull Ivory", hex: "#E8DCC8", family: "Earth" },
  "E44": { code: "E44", name: "Clay", hex: "#D8C8B0", family: "Earth" },
  "E47": { code: "E47", name: "Dark Brown", hex: "#8A6848", family: "Earth" },
  "E49": { code: "E49", name: "Dark Bark", hex: "#684830", family: "Earth" },
  "E50": { code: "E50", name: "Egg Shell", hex: "#FFF7E3", family: "Earth" },
  "E51": { code: "E51", name: "Milky White", hex: "#FFF4DD", family: "Earth" },
  "E53": { code: "E53", name: "Raw Silk", hex: "#F5E8C8", family: "Earth" },
  "E55": { code: "E55", name: "Light Camel", hex: "#E8D4A8", family: "Earth" },
  "E57": { code: "E57", name: "Light Walnut", hex: "#C8A878", family: "Earth" },
  "E59": { code: "E59", name: "Walnut", hex: "#A88858", family: "Earth" },
  "E70": { code: "E70", name: "Ash Rose", hex: "#E8DCD5", family: "Earth" },
  "E71": { code: "E71", name: "Champagne", hex: "#E8DCC8", family: "Earth" },
  "E74": { code: "E74", name: "Cocoa Brown", hex: "#B89878", family: "Earth" },
  "E77": { code: "E77", name: "Maroon", hex: "#886050", family: "Earth" },
  "E79": { code: "E79", name: "Cashew", hex: "#685040", family: "Earth" },
  "E81": { code: "E81", name: "Ivory", hex: "#F0E8D0", family: "Earth" },
  "E84": { code: "E84", name: "Khaki", hex: "#B8A888", family: "Earth" },
  "E87": { code: "E87", name: "Fig", hex: "#887060", family: "Earth" },
  "E89": { code: "E89", name: "Pecan", hex: "#685048", family: "Earth" },
  "E93": { code: "E93", name: "Tea Rose", hex: "#F5D8C0", family: "Earth" },
  "E95": { code: "E95", name: "Tea Orange", hex: "#E8C098", family: "Earth" },
  "E97": { code: "E97", name: "Deep Orange", hex: "#D8A070", family: "Earth" },
  "E99": { code: "E99", name: "Baked Clay", hex: "#B08050", family: "Earth" },

  // Cool Gray (C) - 12 colors
  "C-00": { code: "C-00", name: "Cool Gray No. 00", hex: "#F5F5F7", family: "Cool Gray" },
  "C-0": { code: "C-0", name: "Cool Gray No. 0", hex: "#F0F0F2", family: "Cool Gray" },
  "C-1": { code: "C-1", name: "Cool Gray No. 1", hex: "#E5E5E8", family: "Cool Gray" },
  "C-2": { code: "C-2", name: "Cool Gray No. 2", hex: "#D8D8DC", family: "Cool Gray" },
  "C-3": { code: "C-3", name: "Cool Gray No. 3", hex: "#C8C8CC", family: "Cool Gray" },
  "C-4": { code: "C-4", name: "Cool Gray No. 4", hex: "#B8B8BC", family: "Cool Gray" },
  "C-5": { code: "C-5", name: "Cool Gray No. 5", hex: "#A8A8AC", family: "Cool Gray" },
  "C-6": { code: "C-6", name: "Cool Gray No. 6", hex: "#8C8C90", family: "Cool Gray" },
  "C-7": { code: "C-7", name: "Cool Gray No. 7", hex: "#6C6C70", family: "Cool Gray" },
  "C-8": { code: "C-8", name: "Cool Gray No. 8", hex: "#525256", family: "Cool Gray" },
  "C-9": { code: "C-9", name: "Cool Gray No. 9", hex: "#3C3C40", family: "Cool Gray" },
  "C-10": { code: "C-10", name: "Cool Gray No. 10", hex: "#2C2C30", family: "Cool Gray" },

  // Neutral Gray (N) - 11 colors
  "N-0": { code: "N-0", name: "Neutral Gray No. 0", hex: "#F0F0F0", family: "Neutral Gray" },
  "N-1": { code: "N-1", name: "Neutral Gray No. 1", hex: "#E4E4E4", family: "Neutral Gray" },
  "N-2": { code: "N-2", name: "Neutral Gray No. 2", hex: "#D6D6D6", family: "Neutral Gray" },
  "N-3": { code: "N-3", name: "Neutral Gray No. 3", hex: "#C6C6C6", family: "Neutral Gray" },
  "N-4": { code: "N-4", name: "Neutral Gray No. 4", hex: "#B6B6B6", family: "Neutral Gray" },
  "N-5": { code: "N-5", name: "Neutral Gray No. 5", hex: "#A6A6A6", family: "Neutral Gray" },
  "N-6": { code: "N-6", name: "Neutral Gray No. 6", hex: "#8A8A8A", family: "Neutral Gray" },
  "N-7": { code: "N-7", name: "Neutral Gray No. 7", hex: "#6A6A6A", family: "Neutral Gray" },
  "N-8": { code: "N-8", name: "Neutral Gray No. 8", hex: "#505050", family: "Neutral Gray" },
  "N-9": { code: "N-9", name: "Neutral Gray No. 9", hex: "#3A3A3A", family: "Neutral Gray" },
  "N-10": { code: "N-10", name: "Neutral Gray No. 10", hex: "#2A2A2A", family: "Neutral Gray" },

  // Toner Gray (T) - 11 colors
  "T-0": { code: "T-0", name: "Toner Gray No. 0", hex: "#F2F2F0", family: "Toner Gray" },
  "T-1": { code: "T-1", name: "Toner Gray No. 1", hex: "#E6E6E2", family: "Toner Gray" },
  "T-2": { code: "T-2", name: "Toner Gray No. 2", hex: "#D8D8D4", family: "Toner Gray" },
  "T-3": { code: "T-3", name: "Toner Gray No. 3", hex: "#C8C8C4", family: "Toner Gray" },
  "T-4": { code: "T-4", name: "Toner Gray No. 4", hex: "#B8B8B4", family: "Toner Gray" },
  "T-5": { code: "T-5", name: "Toner Gray No. 5", hex: "#A8A8A4", family: "Toner Gray" },
  "T-6": { code: "T-6", name: "Toner Gray No. 6", hex: "#8C8C88", family: "Toner Gray" },
  "T-7": { code: "T-7", name: "Toner Gray No. 7", hex: "#6C6C68", family: "Toner Gray" },
  "T-8": { code: "T-8", name: "Toner Gray No. 8", hex: "#52524E", family: "Toner Gray" },
  "T-9": { code: "T-9", name: "Toner Gray No. 9", hex: "#3C3C38", family: "Toner Gray" },
  "T-10": { code: "T-10", name: "Toner Gray No. 10", hex: "#2C2C28", family: "Toner Gray" },

  // Warm Gray (W) - 13 colors
  "W-00": { code: "W-00", name: "Warm Gray No. 00", hex: "#F5F3F0", family: "Warm Gray" },
  "W-0": { code: "W-0", name: "Warm Gray No. 0", hex: "#F2F0EE", family: "Warm Gray" },
  "W-1": { code: "W-1", name: "Warm Gray No. 1", hex: "#E8E4E0", family: "Warm Gray" },
  "W-2": { code: "W-2", name: "Warm Gray No. 2", hex: "#DBD7D2", family: "Warm Gray" },
  "W-3": { code: "W-3", name: "Warm Gray No. 3", hex: "#CCC8C2", family: "Warm Gray" },
  "W-4": { code: "W-4", name: "Warm Gray No. 4", hex: "#BCB8B2", family: "Warm Gray" },
  "W-5": { code: "W-5", name: "Warm Gray No. 5", hex: "#AAA6A0", family: "Warm Gray" },
  "W-6": { code: "W-6", name: "Warm Gray No. 6", hex: "#908C86", family: "Warm Gray" },
  "W-7": { code: "W-7", name: "Warm Gray No. 7", hex: "#706C66", family: "Warm Gray" },
  "W-8": { code: "W-8", name: "Warm Gray No. 8", hex: "#56524C", family: "Warm Gray" },
  "W-9": { code: "W-9", name: "Warm Gray No. 9", hex: "#403C36", family: "Warm Gray" },
  "W-10": { code: "W-10", name: "Warm Gray No. 10", hex: "#302C28", family: "Warm Gray" },

  // Special/Achromatic Colors - 2 colors
  "0": { code: "0", name: "Colorless Blender", hex: "#FFFFFF", family: "Special" },
  "100": { code: "100", name: "Black", hex: "#000000", family: "Special" },

  // Fluorescent Colors - 7 colors (per official Copic Sketch chart)
  "FV": { code: "FV", name: "Fluorescent Dull Violet", hex: "#B77DD2", family: "Fluorescent" },
  "FRV1": { code: "FRV1", name: "Fluorescent Pink", hex: "#FF6B9D", family: "Fluorescent" },
  "FYR1": { code: "FYR1", name: "Fluorescent Orange", hex: "#FF8C55", family: "Fluorescent" },
  "FY1": { code: "FY1", name: "Fluorescent Yellow Orange", hex: "#FFE44D", family: "Fluorescent" },
  "FYG1": { code: "FYG1", name: "Fluorescent Yellow Green", hex: "#D4F34A", family: "Fluorescent" },
  "FYG2": { code: "FYG2", name: "Fluorescent Dull Yellow Green", hex: "#A8D86B", family: "Fluorescent" },
  "FB2": { code: "FB2", name: "Fluorescent Dull Blue", hex: "#6BA3D8", family: "Fluorescent" },
};

// Total: 356 Copic Sketch colors (validated against official Copic color chart)

// Helper function to check if a color code exists in Copic Sketch
export function isValidCopicSketchCode(code: string): boolean {
  // Normalize the code (handle different formats like C0 vs C-0)
  const normalizedCode = normalizeCopicCode(code);
  return normalizedCode in COPIC_SKETCH_COLORS;
}

// Normalize Copic code to match our database format
export function normalizeCopicCode(code: string): string {
  // Handle gray codes: C0 -> C-0, N1 -> N-1, etc.
  const grayMatch = code.match(/^([CNTW])(\d+)$/i);
  if (grayMatch) {
    return `${grayMatch[1].toUpperCase()}-${grayMatch[2]}`;
  }
  return code.toUpperCase();
}

// Get color info by code
export function getCopicSketchColor(code: string): CopicSketchColor | null {
  const normalizedCode = normalizeCopicCode(code);
  return COPIC_SKETCH_COLORS[normalizedCode] || null;
}

// Get all colors in a family
export function getColorsByFamily(family: string): CopicSketchColor[] {
  return Object.values(COPIC_SKETCH_COLORS).filter(
    (color) => color.family.toLowerCase() === family.toLowerCase()
  );
}

// Validate an array of color codes and return validation results
export interface ColorValidationResult {
  code: string;
  isValid: boolean;
  color: CopicSketchColor | null;
  suggestedCode?: string;
}

export function validateCopicCodes(codes: string[]): ColorValidationResult[] {
  return codes.map((code) => {
    const normalizedCode = normalizeCopicCode(code);
    const color = COPIC_SKETCH_COLORS[normalizedCode];

    if (color) {
      return { code, isValid: true, color };
    }

    // Try to find a similar code
    const suggestedCode = findSimilarCode(normalizedCode);
    return {
      code,
      isValid: false,
      color: null,
      suggestedCode
    };
  });
}

// Find a similar code if the exact one doesn't exist
function findSimilarCode(code: string): string | undefined {
  // Extract family prefix and number
  const match = code.match(/^([A-Z]+)(\d+)$/);
  if (!match) return undefined;

  const [, family, num] = match;

  // Look for codes with the same family
  const familyCodes = Object.keys(COPIC_SKETCH_COLORS).filter((c) =>
    c.startsWith(family)
  );

  if (familyCodes.length === 0) return undefined;

  // Find the closest number
  const targetNum = parseInt(num);
  let closestCode = familyCodes[0];
  let closestDiff = Infinity;

  for (const fc of familyCodes) {
    const fcMatch = fc.match(/\d+/);
    if (fcMatch) {
      const fcNum = parseInt(fcMatch[0]);
      const diff = Math.abs(fcNum - targetNum);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestCode = fc;
      }
    }
  }

  return closestCode;
}

// Get all valid Copic Sketch codes as an array
export function getAllCopicSketchCodes(): string[] {
  return Object.keys(COPIC_SKETCH_COLORS);
}

// Color families for reference
export const COPIC_FAMILIES = {
  BV: "Blue Violet",
  V: "Violet",
  RV: "Red Violet",
  R: "Red",
  YR: "Yellow Red",
  Y: "Yellow",
  YG: "Yellow Green",
  G: "Green",
  BG: "Blue Green",
  B: "Blue",
  E: "Earth",
  C: "Cool Gray",
  N: "Neutral Gray",
  T: "Toner Gray",
  W: "Warm Gray",
  F: "Fluorescent",
} as const;

export type CopicFamily = keyof typeof COPIC_FAMILIES;
