const analysisMethodsQuiz = {
    QUIZ_CONTAINER_ID: 'analysis-methods-quiz-container',
    QUIZ_CONTAINER: null,

    CONFIG_FORM_ID: 'analysis-methods-quiz-form',
    CONFIG_PATH: 'login-php/analysis-methods-quiz/config.php',

    USER_SCORE_PATH: 'login-php/analysis-methods-quiz/user-score.php',
    USER_SCORE_EL_ID: 'analysis-methods-quiz-user-score',

    STEP_SUBMIT_PATH: 'login-php/analysis-methods-quiz/step-submit.php',
    STEP_FORM_ID: 'analysis-methods-quiz-step-form',
    STEP_FORM: null,
    STEP_CONTAINER_ID: 'analysis-methods-quiz-step-container',
    STEP_CONTAINER: null,

    STEP_COUNT: 0,
    NEXT_STEP_HTML: null,

    ERROR_MSG_GENERIC: 'An error ocurred when fetching the quiz data',
    ERROR_MSG_STEP_SUBMIT: undefined,

    hintDisplayedCount: 0,

    ACTIVE_THEME: null,
    ASSISTED_QUIZ_CONTAINER_ID: 'assisted-quiz-container',
    ASSISTED_QUIZ_CONTAINER: null,
    ASSISTED_QUIZ_ID: 'assisted-quiz',
    ASSISTED_QUIZ: null,
    ASSISTED_QUIZ_BACK_TO_THEMES_ID: 'assisted-quiz-back-to-themes',
    ASSISTED_THEMES_CONTAINER_ID: 'assisted-themes-container',
    ASSISTED_THEMES_CONTAINER: null,
    CONFIG_THEME_PATH: 'login-php/analysis-methods-quiz/config-theme.php',


    RANDOM_QUIZ_CONTAINER_ID: 'random-methods-quiz-container',
    RANDOM_QUIZ_CONTAINER: null,

    RANDOM_CONFIG_FORM_ID: 'random-methods-quiz-form',
    RANDOM_CONFIG_PATH: 'login-php/analysis-methods-quiz/random-config.php',
    RANDOM_USER_SCORE_EL_ID: 'random-methods-quiz-user-score',
    
    QUIZ_LIST_FOR_ADMIN_CONTAINER_ID: 'am-quiz-list-for-admin',
    QUIZ_LIST_FOR_ADMIN_PATH: 'login-php/analysis-methods-quiz/quiz-list-for-admin.php',

    init() {
        this.QUIZ_CONTAINER = document.getElementById(this.QUIZ_CONTAINER_ID)

        const CONFIG_FORM = document.getElementById(this.CONFIG_FORM_ID)

        CONFIG_FORM
            .addEventListener('submit', (event) => {
                document.getElementById('random_reset').click();
                document.getElementById(this.ASSISTED_QUIZ_BACK_TO_THEMES_ID).click();
                event.preventDefault()
                event.target.querySelector('button[type="reset"]').style.display = 'inline'

                this.submitConfigForm(new FormData(event.target))
            })

        CONFIG_FORM.addEventListener('reset', (event) => {
            event.target.querySelector('button[type="reset"]').style.display = 'none'
            this.QUIZ_CONTAINER.innerHTML = ''
        })

        this.updateUserScore()

        this.ASSISTED_QUIZ = document.getElementById(this.ASSISTED_QUIZ_ID)
        this.ASSISTED_QUIZ_CONTAINER = document.getElementById(this.ASSISTED_QUIZ_CONTAINER_ID)
        this.ASSISTED_THEMES_CONTAINER = document.getElementById(this.ASSISTED_THEMES_CONTAINER_ID)

        this.ASSISTED_THEMES_CONTAINER.addEventListener('click', (event) => {
            document.getElementById('method_reset').click();
            document.getElementById('random_reset').click();
            if (event.target.tagName === 'BUTTON' && event.target.dataset.theme) {
                this.ACTIVE_THEME = event.target.dataset.theme
                this.STEP_COUNT = 0
                this.ASSISTED_QUIZ_CONTAINER = document.getElementById(this.ASSISTED_QUIZ_CONTAINER_ID)
                this.initQuizViaTheme(event.target.dataset.theme)
            }
        })

        document.getElementById(this.ASSISTED_QUIZ_BACK_TO_THEMES_ID).addEventListener('click', () => {
            this.ACTIVE_THEME = null;
            this.STEP_COUNT = 0;
            this.ASSISTED_QUIZ.innerHTML = '';
            this.ASSISTED_QUIZ_CONTAINER.style.display = 'none'
            this.ASSISTED_THEMES_CONTAINER.style.display = 'block'
        })

        this.RANDOM_QUIZ_CONTAINER = document.getElementById(this.RANDOM_QUIZ_CONTAINER_ID);
        const RANDOM_CONFIG_FORM = document.getElementById(this.RANDOM_CONFIG_FORM_ID)

        RANDOM_CONFIG_FORM
            .addEventListener('submit', (event) => {
                document.getElementById(this.ASSISTED_QUIZ_BACK_TO_THEMES_ID).click();
                document.getElementById('method_reset').click();
                event.preventDefault();
                event.target.querySelector('button[type="reset"]').style.display = 'inline'

                this.submitRandomConfigForm(new FormData(event.target));
            })

        RANDOM_CONFIG_FORM.addEventListener('reset', (event) => {
            event.target.querySelector('button[type="reset"]').style.display = 'none'
            this.RANDOM_QUIZ_CONTAINER.innerHTML = ''
        })

        this.fetchQuizListForAdmin()
    },

    fetchQuizListForAdmin() {
        fetch(this.QUIZ_LIST_FOR_ADMIN_PATH)
            .then(response => {
                if (response.ok === false) {
                    return
                }

                response.json()
                    .then((data) => this.handleQuizListForAdminResponse(data))
            })
    },

    handleQuizListForAdminResponse(list) {
        if (typeof list !== 'object' || list.length === 0) {
            return
        }

        const container = document.getElementById(this.QUIZ_LIST_FOR_ADMIN_CONTAINER_ID)
        const containerSelect = container.querySelector('select')

        // clear existing options, except for first one
        containerSelect.querySelectorAll('option:not(:first-child)').forEach((option) => option.remove())

        // add new options [one for each quiz]
        list.forEach((id) => {
            const option = document.createElement('option')
            option.value = id
            option.innerText = id
            containerSelect.appendChild(option)
        })

        // submit config form when user selects a quiz and send only the Quiz ID
        containerSelect.addEventListener('change', (event) => {
            const quizId = event.target.value
            if (!quizId)
                return;

            const formData = new FormData()
            formData.set('quiz_id', quizId)
            this.submitConfigForm(formData)
        })

        container.classList.remove('hidden')
    },

    submitConfigForm(data) {
        fetch(this.CONFIG_PATH, {
            body: data,
            method: 'POST',
        })
            .then(response => {
                if (response.ok === false) {
                    response.text().then((text) => alert(text ? text : this.ERROR_MSG_GENERIC))
                    return
                }

                response.json()
                    .then((data) => this.handleConfigFormResponse(data))
                    .catch(() => alert(this.ERROR_MSG_GENERIC))
            })
            .catch(() => alert(this.ERROR_MSG_GENERIC))
    },

    submitRandomConfigForm(data) {
        fetch(this.RANDOM_CONFIG_PATH, {
            body: data,
            method: 'POST',
        })
            .then(response => {
                if (response.ok === false) {
                    response.text().then((text) => alert(text ? text : this.ERROR_MSG_GENERIC))
                    return
                }

                response.json()
                    .then((data) => this.handleRandomConfigFormResponse(data))
                    .catch(() => alert(this.ERROR_MSG_GENERIC))
            })
            .catch(() => alert(this.ERROR_MSG_GENERIC))
    },

    handleConfigFormResponse(data) {
        if (data.ok !== true) {
            alert('No quiz found, sorry!')
            return
        }
        this.hintDisplayedCount = 0
        this.loadQuizHtml(this.QUIZ_CONTAINER, data.html)

        this.QUIZ_CONTAINER
            .querySelector('button[data-action="admin-goto-edit-quiz"]')
            ?.addEventListener('click', () => {
                showSection('am-quiz-admin')
                analysisMethodsQuizAdmin.loadEdit(data.quiz_id)
            })
    },

    handleRandomConfigFormResponse(data) {
        if (data.ok !== true) {
            alert('No quiz found, sorry!')
            return
        }

        this.loadRandomQuizHtml(this.RANDOM_QUIZ_CONTAINER, data.html)
    },

    loadQuizHtml(container, html) {
        container.innerHTML = html
        this.loadTranslations()

        this.STEP_COUNT++

        this.STEP_FORM = document.getElementById(this.STEP_FORM_ID)
        this.STEP_CONTAINER = document.getElementById(this.STEP_CONTAINER_ID)

        this.STEP_FORM.addEventListener('submit', (event) => {
            event.preventDefault()
            this.stepSubmit(new FormData(event.target))
        })

        this.STEP_FORM.querySelector('.next-step-btn').addEventListener('click', () => this.showNextStep())

        window.scrollTo({
            top: this.QUIZ_CONTAINER.offsetTop - 30 - document.getElementById('page-top')?.offsetHeight ?? 0,
            behavior: 'smooth'
        })
        setTimeout(() => this.STEP_CONTAINER.querySelector('.input')?.focus(), 500)
    },

    loadRandomQuizHtml(container, html) {
        container.innerHTML = html

        this.STEP_COUNT++

        this.STEP_FORM = document.getElementById(this.STEP_FORM_ID)
        this.STEP_CONTAINER = document.getElementById(this.STEP_CONTAINER_ID)

        this.STEP_FORM.addEventListener('submit', (event) => {
            event.preventDefault()
            this.stepSubmit(new FormData(event.target))
        })

        this.STEP_FORM.querySelector('.next-step-btn').addEventListener('click', () => this.showNextStep())

        window.scrollTo({
            top: this.RANDOM_QUIZ_CONTAINER.offsetTop - 30 - document.getElementById('page-top')?.offsetHeight ?? 0,
            behavior: 'smooth'
        })
        setTimeout(() => this.STEP_CONTAINER.querySelector('.input')?.focus(), 500)
    },

    stepSubmit(data) {
        this.STEP_FORM.classList.remove('msg-error');

        data.set('hint_displayed_count', this.hintDisplayedCount)

        if (this.ACTIVE_THEME) {
            data.set('theme', this.ACTIVE_THEME)
        }

        fetch(this.STEP_SUBMIT_PATH, {
            body: data,
            method: 'POST'
        })
            .then(response => {
                if (response.ok === false) {
                    response.text().then((text) => alert(text ? text : this.ERROR_MSG_STEP_SUBMIT))
                    return
                }

                response.json()
                    .then((data) => this.handleStepSubmitResponse(data))
                    .catch(() => alert(this.ERROR_MSG_STEP_SUBMIT))
            })
            .catch(() => alert(this.ERROR_MSG_STEP_SUBMIT))
    },

    handleStepSubmitResponse(data) {
        if (!data.is_correct) {
            const submitBtn = this.STEP_FORM.querySelector('button[type="submit"]')
            submitBtn.classList.add('shakeX')
            setTimeout(() => submitBtn.classList.remove('shakeX'), 1000)

            this.STEP_CONTAINER.querySelector('.input')?.focus()

            if (data.hint) {
                setTimeout(() => this.updateHint(data.hint), 500)

                this.STEP_FORM.classList.add('msg-error-with-hints');
                setTimeout(() => this.STEP_FORM.classList.remove('msg-error-with-hints'), 3000)
                return
            }
            else if (data.answer) {
                this.updateHint(null)

                this.STEP_FORM.classList.add('msg-error');
                setTimeout(() => this.STEP_FORM.classList.remove('msg-error'), 3000)

                setTimeout(() => this.showAnswer(data.type, data.answer), 500)
            }
        }

        this.hintDisplayedCount = 0

        if (data.next_step_html) {
            this.NEXT_STEP_HTML = data.next_step_html
            this.STEP_FORM.classList.add('ready-for-next-step')
            this.STEP_CONTAINER.querySelectorAll('input').forEach((input) => input.disabled = true)
        } else if (this.ACTIVE_THEME) {
            this.STEP_FORM.classList.add('ready-for-next-step')
            this.STEP_CONTAINER.querySelectorAll('input').forEach((input) => input.disabled = true)
        } else {
            this.STEP_FORM.classList.add('quiz-ended')
            this.updateUserScore()
        }

        if (data.is_correct) {
            this.STEP_CONTAINER.querySelector('input:checked')?.closest('label').classList.add('correct')
            this.STEP_CONTAINER.querySelector('.input')?.classList.add('correct')

            this.STEP_FORM.classList.add('msg-success');
            setTimeout(() => this.STEP_FORM.classList.remove('msg-success'), 2000)
        }
    },

    showAnswer(type, answer) {
        let el;

        if (type === 'multiple') {
            el = this.STEP_CONTAINER.querySelector(`input[type="radio"][value="${answer}"]`).closest('label')
        } else {
            el = this.STEP_CONTAINER.querySelector('.input')
            el.disabled = true
            el.value = answer
        }

        el.classList.add('correct')
    },

    showNextStep() {
        if (this.ACTIVE_THEME) {
            return this.showNextStepViaTheme()
        }
        else if (!this.NEXT_STEP_HTML) {
            return
        }

        this.STEP_COUNT++

        this.STEP_FORM.classList.remove('ready-for-next-step')
        this.STEP_FORM.classList.remove('msg-success')

        this.STEP_CONTAINER.innerHTML = this.NEXT_STEP_HTML

        setTimeout(() => this.STEP_CONTAINER.querySelector('.input')?.focus(), 500)

        this.NEXT_STEP_HTML = null
    },

    updateHint(hint) {
        const hintsContainer = this.STEP_CONTAINER.querySelector('.hints-container')

        if (!hint) {
            hintsContainer.classList.remove('visible')

            return
        }

        hintsContainer.classList.add('visible')

        const hintsList = hintsContainer.querySelector('ul')
        hintsList.innerHTML += '<li>' + hint + '</li>'

        this.hintDisplayedCount++
    },

    updateUserScore() {
        fetch(this.USER_SCORE_PATH)
            .then(response => {
                response.json()
                    .then((data) => {
                        if (typeof data.quiz_score === 'undefined')
                            return

                        const el = document.getElementById(this.USER_SCORE_EL_ID)
                        const random_el = document.getElementById(this.RANDOM_USER_SCORE_EL_ID)

                        el.querySelector('span').innerText = data.quiz_score
                        el.style.display = 'flex'

                        random_el.querySelector('span').innerText = data.quiz_score
                        random_el.style.display = 'flex'
                    })
            })
    },

    initQuizViaTheme(theme) {
        const data = new FormData()
        data.set('theme', theme)
        data.set('step_count', this.STEP_COUNT)
        this.hintDisplayedCount = 0

        fetch(this.CONFIG_THEME_PATH, {
            body: data,
            method: 'POST',
        })
            .then(response => {
                if (response.ok === false) {
                    response.text().then((text) => alert(text ? text : this.ERROR_MSG_GENERIC))
                    return
                }

                response.json()
                    .then((data) => this.handleQuizViaThemeResponse(data))
                    .catch(() => alert(this.ERROR_MSG_GENERIC))
            })
            .catch(() => alert(this.ERROR_MSG_GENERIC))
    },

    handleQuizViaThemeResponse(data) {
        if (!data.ok && !this.STEP_COUNT) {
            alert('No quiz found, sorry!')
            return
        } else if (!data.ok) {
            this.STEP_FORM.classList.add('quiz-ended')
            alert('No more questions in this theme, sorry!')
            return
        }

        this.loadQuizHtml(this.ASSISTED_QUIZ, data.html)

        this.ASSISTED_THEMES_CONTAINER.style.display = 'none'
        this.ASSISTED_QUIZ_CONTAINER.style.display = 'block'
    },

    showNextStepViaTheme() {
        this.initQuizViaTheme(this.ACTIVE_THEME)
    },

    loadTranslations() {
        const language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
        set_lang(language === 'english' ? dictionary.english : dictionary.portuguese)
    }
}

window.addEventListener('load', () => analysisMethodsQuiz.init())
