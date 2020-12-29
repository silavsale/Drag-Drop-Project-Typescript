// Validation logic
interface Validatable {
    value: string | number,
    required?: boolean,
    minLenght?: number, 
    maxLenght?: number,
    min?: number,
    max?: number
}

function validate(validatableInput: Validatable) {
    let isValid = true
    if (validatableInput.required) {
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0
        }
        if (validatableInput.minLenght != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length > validatableInput.minLenght
        }
        if (validatableInput.maxLenght != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length < validatableInput.maxLenght
        }
        if ( validatableInput.min != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value > validatableInput.min
        }
        if ( validatableInput.max != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value < validatableInput.max
        }
    }
    return isValid
}

// autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}
class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input'

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement

        this.configure()
        this.attach()
    }

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
            return [enteredTPeople, enteredDescription, +enteredTPeople]
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
            // console.log(title, desc, people);
            this.clearInput()
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler) // use .bind(this) or decorator to bind 
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const prjInput = new ProjectInput()