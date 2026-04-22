export interface WeaponUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    damageBonus: number;
    rangeBonus: number;
    effect?: 'fire' | 'ice' | 'holy';
    color: number;
    requires?: string;
}

export const WEAPON_UPGRADES: WeaponUpgrade[] = [
    {
        id: 'iron_sword',
        name: 'Épée de fer',
        description: 'Augmente les dégâts de +1',
        cost: 10,
        damageBonus: 1,
        rangeBonus: 0,
        color: 0xaaaaaa,
    },
    {
        id: 'long_sword',
        name: 'Épée longue',
        description: 'Portée étendue +15px',
        cost: 15,
        damageBonus: 0,
        rangeBonus: 15,
        color: 0xccccdd,
        requires: 'iron_sword',
    },
    {
        id: 'fire_sword',
        name: 'Épée de feu',
        description: 'Inflige des brûlures (+2 dégâts)',
        cost: 30,
        damageBonus: 2,
        rangeBonus: 0,
        effect: 'fire',
        color: 0xff4400,
        requires: 'long_sword',
    },
    {
        id: 'ice_sword',
        name: 'Épée de glace',
        description: 'Ralentit les ennemis (+1 dégât)',
        cost: 30,
        damageBonus: 1,
        rangeBonus: 10,
        effect: 'ice',
        color: 0x44aaff,
        requires: 'long_sword',
    },
    {
        id: 'holy_sword',
        name: 'Épée sacrée',
        description: 'Dégâts massifs (+4), portée +20',
        cost: 50,
        damageBonus: 4,
        rangeBonus: 20,
        effect: 'holy',
        color: 0xffdd00,
        requires: 'fire_sword',
    },
];
