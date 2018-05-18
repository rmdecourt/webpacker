import '../../css/components/button.styl'

export class Button {

    constructor(element, action) {
        this.element = element;
        this.element.addEventListener('click', action);
    }

}