import FlashCardsHomeScreen from '../flashcards/FlashCardsHomeViewContainer';
import SettingsScreen from '../flashcards/SettingsContainer';
import GridsScreen from '../grids/GridsViewContainer';
import ComponentsScreen from '../components/ComponentsViewContainer';

const iconHome = require('../../../assets/images/tabbar/home.png');
const iconGrids = require('../../../assets/images/tabbar/grids.png');
const iconComponents = require('../../../assets/images/tabbar/components.png');
const iconSettings = require('../../../assets/images/drawer/settings.png');

const tabNavigationData = [
  {
    name: 'Flash Cards',
    component: FlashCardsHomeScreen,
    icon: iconHome,
  },
  {
    name: 'Grids',
    component: GridsScreen,
    icon: iconGrids,
  },
  {
    name: 'Components',
    component: ComponentsScreen,
    icon: iconComponents,
  },
  {
    name: 'Settings',
    component: SettingsScreen,
    icon: iconSettings,
  },
];

export default tabNavigationData;
