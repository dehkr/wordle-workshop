import Alpine from '@alpinejs/csp';
import persist from '@alpinejs/persist'
import { game } from './game/game';

Alpine.plugin(persist);

Alpine.data('game', game);

Alpine.start();
