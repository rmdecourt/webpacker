import '../../css/app.styl';
import { Button } from '../components/Button';

class App {
    constructor() {
        let button = new Button(document.querySelector('.btn'), () => {
            alert('clicked');
        });
    }
}

new App();