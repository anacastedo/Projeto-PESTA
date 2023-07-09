const analysisMethodsQuizAdmin = {
    SECTION_ID: 'section-am-quiz-admin',
    SECTION_EL: null,
    VIEW_EL: null,

    BASE_VIEW_PATH: 'login-php/analysis-methods-quiz-admin/base-view.php',
    INDEX_PATH: 'login-php/analysis-methods-quiz-admin/index.php',
    CREATE_PATH: 'login-php/analysis-methods-quiz-admin/create.php',
    STORE_PATH: 'login-php/analysis-methods-quiz-admin/store.php',
    EDIT_PATH: 'login-php/analysis-methods-quiz-admin/edit.php',
    UPDATE_PATH: 'login-php/analysis-methods-quiz-admin/update.php',
    DELETE_PATH: 'login-php/analysis-methods-quiz-admin/delete.php',

    DELETE_CONFIRM_MSG: 'Are you sure you want to delete this quiz?',
    ERROR_MSG_GENERIC: 'An error occurred',

    QUIZ_ID: null,

    CREATE_BTN_ID: 'btn-for-create',
    UPDATE_BTNS_ID: 'btns-for-update',

    init() {
        this.SECTION_EL = document.getElementById(this.SECTION_ID)

        fetch(this.BASE_VIEW_PATH, {
            method: 'GET',
        })
            .then(response => response.text())
            .then(html => {
                if (!html) {
                    return
                }

                this.SECTION_EL.innerHTML = html
                this.loadTranslations()
                this.VIEW_EL = this.SECTION_EL.querySelector('[data-id="view"]')

                const developerInsights = document.getElementById('developer-insights')
                const navItem = document.getElementById('nav-item-am-quiz-admin')
                navItem.style.display = 'block'
                developerInsights.style.display = 'block'
                navItem.addEventListener('click', () => this.loadIndex())
            })
            .catch(() => alert(this.ERROR_MSG_GENERIC))

        this.SECTION_EL.addEventListener('click', (event) => {
            if (event.target.dataset.action === 'index') {
                this.loadIndex()
            }
            if (event.target.dataset.action === 'create') {
                this.loadCreate()
            }
        })
    },

    loadIndex() {
        fetch(this.INDEX_PATH, {
            method: 'GET',
        })
            .then(response => response.text())
            .then(html => {
                this.VIEW_EL.innerHTML = html
                this.loadTranslations()
                this.VIEW_EL
                    .querySelectorAll('table tr [data-action="delete"]')
                    .forEach(button => button.addEventListener('click', () => this.delete(button.dataset.id, button)))

                this.VIEW_EL
                    .querySelectorAll('table tr [data-action="edit"]')
                    .forEach(button => button.addEventListener('click', () => this.loadEdit(button.dataset.id)))
            })
            .catch(() => alert(this.ERROR_MSG_GENERIC))
    },

    loadCreate() {
        this.QUIZ_ID = null
        fetch(this.CREATE_PATH, {
            method: 'GET',
        })
            .then(response => response.text())
            .then(html => {
                this.VIEW_EL.innerHTML = html
                this.VIEW_EL.querySelector('#' + this.CREATE_BTN_ID).classList.remove('hidden')
                this.VIEW_EL.querySelector('#' + this.UPDATE_BTNS_ID).classList.add('hidden')
                this.loadTranslations()
                this.registerFormEventListeners(this.VIEW_EL.querySelector('form'))
            })
            .catch(() => alert(this.ERROR_MSG_GENERIC))
    },

    loadEdit(id) {
        fetch(`${this.EDIT_PATH}?id=${id}`, {
            method: 'GET',
        })
            .then(response => response.text())
            .then(html => {
                this.QUIZ_ID = id
                this.VIEW_EL.innerHTML = html
                this.VIEW_EL.querySelector('#' + this.CREATE_BTN_ID).classList.add('hidden')
                this.VIEW_EL.querySelector('#' + this.UPDATE_BTNS_ID).classList.remove('hidden')
                this.loadTranslations()
                this.registerFormEventListeners(this.VIEW_EL.querySelector('form'))
            })
            .catch(() => alert(this.ERROR_MSG_GENERIC))
    },

    delete(id, target) {
        if (!confirm(this.DELETE_CONFIRM_MSG)) {
            return;
        }

        const data = new FormData;
        data.append('id', id)

        fetch(this.DELETE_PATH, {
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    target?.closest('tr').remove();
                    return
                }

                alert(this.ERROR_MSG_GENERIC)
            })
            .catch(() => alert(this.ERROR_MSG_GENERIC))
    },

    registerFormEventListeners(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            this.submitForm(event.target)
        })

        const stepList = form.querySelector('.step-list')

        stepList.addEventListener('click', (event) => {
            let target = event.target

            if (target.tagName !== 'BUTTON')
                target = target.closest('button')

            if (!target)
                return

            if (target.dataset.action === 'remove-step') {
                target.closest('.step').remove()
                stepList.dataset.stepCount = parseInt(stepList.dataset.stepCount) - 1

                Array.from(stepList.children).forEach((step, index) => {
                    step.querySelector('.step-nb').textContent = index + 1
                })

            } else if (target.dataset.action === 'add-option') {
                const option = target.previousElementSibling
                const list = target.closest('.option-list')
                const index = Array.from(list.children).indexOf(option)
                const newIndex = index + 1

                if (option.classList.contains('step-hint')
                    && index === 0
                    && option.style.display === 'none') {
                    // if this is a hint and it is the first option, just show it because it was't removed
                    option.style.display = 'block'

                    setTimeout(() => option.querySelector('input').focus(), 10)
                    return;
                }

                const clone = option.cloneNode(true)
                const input = clone.querySelector('input')

                input.name = input.name.replace(`][${index}]`, `][${newIndex}]`)
                input.id = ''
                input.value = ''
                input.placeholder = input.placeholder.replace(`#${index + 1}`, `#${newIndex + 1}`)

                list.insertBefore(clone, target)
                setTimeout(() => input.focus(), 0)
            } else if (target.dataset.action === 'remove-option') {
                const option = target.closest('.option')

                // get the index of the option
                const index = Array.from(option.closest('.option-list').children).indexOf(option)

                if (option.classList.contains('step-hint') && index === 0) {
                    // if this is a hint and it is the first option, just hide it, don't remove it (because we need it to clone it later)
                    option.querySelector('input').value = ''
                    option.style.display = 'none'
                    return;
                }

                option.remove()
            } else if (target.dataset.action === 'remove-step-img') {
                target.parentElement.querySelector('img').remove()
                target.parentElement.querySelector('input.input-remove-img').value = '1'
                target.remove()
            }
        })

        form.addEventListener('input', (event) => {
            if (event.target.classList.contains('step-type')) {
                const step = event.target.closest('.step')
                const type = event.target.value
                const stepOptions = step.querySelector('.step-options')

                stepOptions.style.display = type === 'multiple' ? 'block' : 'none'

                const stepAnswerInput = step.querySelector('.step-answer > input')
                stepAnswerInput.type = type === 'free_numeric' ? 'number' : 'text'
            }
        })

        form.querySelector('[data-action="add-step"]').addEventListener('click', () => {
            this.submitForm(form, false)
            const index = parseInt(stepList.dataset.stepCount) - 1
            const newIndex = index + 1

            const clone = stepList.querySelector('.step').cloneNode(true)

            clone.querySelectorAll('label, input, select, textarea').forEach(el => {
                if (el.tagName === 'LABEL') {
                    el.setAttribute('for', el.getAttribute('for').replace(`-s0`, `-s${newIndex}`))
                    return
                }

                el.value = ''

                if (el.tagName === 'TEXTAREA') {
                    el.innerText = ''
                }

                // replace index in name and id
                el.name = el.name.replace(`steps[0]`, `steps[${newIndex}]`)
                el.id = el.id.replace(`-s0`, `-s${newIndex}`)
            })

            clone.querySelector('.step-options').style.display = 'none'

            clone.querySelector('.step-answer > input').type = 'text'
            clone.querySelector('.step-img')?.remove()

            stepList.appendChild(clone)
            clone.querySelector('.step-nb').innerText = newIndex + 1
            stepList.dataset.stepCount = newIndex + 1
        })

        form.querySelector('[data-action="save-and-continue"]')?.addEventListener('click', () => {
            this.submitForm(form,false)
        })
    },

    validateForm(form) {
        let isValid = true
        let firstStepWithError = null

        form.querySelectorAll('.step').forEach((step, index) => {
            const stepType = step.querySelector('.step-type').value

            if (stepType === 'multiple') {
                const options = Array.from(step.querySelectorAll('.step-option > input'))
                    .map(input => input.value.trim())

                const answer = step.querySelector('.step-answer > input').value.trim()

                if (options.indexOf(answer) === -1) {
                    step.querySelector('.step-answer .error-msg').classList.remove('hidden')
                    isValid = false
                    firstStepWithError = firstStepWithError ?? step
                } else {
                    step.querySelector('.step-answer .error-msg').classList.add('hidden')
                }
            }
        })

        firstStepWithError?.scrollIntoView({ behavior: 'smooth' })

        return isValid
    },

    submitForm(form, goToIndex = true) {
        if (!this.validateForm(form)) {
            console.log('form is not valid')
            return
        }
        const data = new FormData(form)

        if (this.QUIZ_ID) {
            data.append('id', this.QUIZ_ID)
        }

        fetch(this.QUIZ_ID ? this.UPDATE_PATH : this.STORE_PATH, {
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    if (goToIndex) {
                        return this.loadIndex()
                    }

                    if (data.id) {
                        this.QUIZ_ID = data.id
                        this.VIEW_EL.querySelector('#' + this.CREATE_BTN_ID).classList.add('hidden')
                        this.VIEW_EL.querySelector('#' + this.UPDATE_BTNS_ID).classList.remove('hidden')
                    }

                    return this.showFormStateMsg(form, 'success')
                }

                return this.showFormStateMsg(form, 'error')
            })
            .catch((err) => this.showFormStateMsg(form, 'error') && console.error(err))
    },

    showFormStateMsg(form, state) {
        const stateMsg = form.querySelector('.amq-admin-form-state-msg.state-' + state)
        stateMsg.classList.add('active')
        setTimeout(() => stateMsg.classList.remove('active'), 3000)
    },

    loadTranslations() {
        const language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
        set_lang(language === 'english' ? dictionary.english : dictionary.portuguese)
    }
}

window.addEventListener('load', () => analysisMethodsQuizAdmin.init())

