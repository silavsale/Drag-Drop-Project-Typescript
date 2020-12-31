
import { Component } from './base-component.js'
import { Validatable, validate } from '../util/validation.js'
import { Autobind } from '../decorators/autobind.js'
import { projectState } from '../state/project-state.js'

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor() {
        super('project-input', 'app', true, 'user-input')
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement


        this.configure()
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler) // use .bind(this) or decorator to bind 
    }

    renderContent() {}

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredTPeople = this.peopleInputElement.value

        const titleValidatable: Validatable = {
            value: enteredTitle, required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription, required: true, minLenght: 5
        }
        const peopleValidatable: Validatable = {
            value: +enteredTPeople, required: true, min: 1, max: 5
        }

        // if (enteredTitle.trim().length === 0 || enteredDescription.trim().length === 0 || enteredTPeople.trim().length === 0){
        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) || 
            !validate(peopleValidatable) 
        ){
            alert('Invalid input, please try again!')
        } else {
            return [enteredTitle, enteredDescription, +enteredTPeople]
        }
    }

    private clearInput() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.gatherUserInput()
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput
            projectState.addProject(title, desc, people)
            // console.log(title, desc, people);
            this.clearInput()
        }
    }
}