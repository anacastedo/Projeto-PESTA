<main id="analysis-methods-quiz">


    <?php if ($showEditQuizBtn ?? false): ?>
    <button class="btn" data-action="admin-goto-edit-quiz">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>

            <span data-translate="_editQuiz"></span>
        </button>
    <?php endif ?>


    <!--Imagem-->
    <?php if ($quiz['image'] ?? null): ?>
    <img src="data:image/png;base64, <?php echo $quiz['image'] ?>">
    <?php endif ?>

    <!--Método / Corrente -->
    <header>
        <div class="method-current">
            <div data-translate="_methodType" style="display:inline-flex">Tipo de Método</div>: <strong><?php echo $quiz['method_type'] ?></strong> /
            <div data-translate="_currentType" style="display:inline-flex">Tipo de Corrente</div>: <strong><?php echo $quiz['current_type'] ?></strong>
        </div>
        <div>
            <?php if ($quiz['image'] ?? null): ?>
            <a href="./login-php/analysis-methods-quiz/download-assets.php?quiz_id=<?php echo $quiz['id'] ?>&asset=image" target="_blank"><div data-translate="_image" style="display:inline-flex">Imagem</div>&darr;</a>
            &nbsp;
            <?php endif ?>

            <?php if ($quiz['netlist'] ?? null): ?>
            <a href="./login-php/analysis-methods-quiz/download-assets.php?quiz_id=<?php echo $quiz['id'] ?>&asset=netlist" target="_blank"><div style="display:inline-flex">Netlist</div>&darr;</a>
            <?php endif ?>
        </div>
    </header>

    <form method="post" id="analysis-methods-quiz-step-form">
        <input type="hidden" name="quiz_id" value="<?php echo $quiz['id'] ?>" />

        <!--Pergunta-->
        <div id="analysis-methods-quiz-step-container">
          <?php
            $step = $quiz['steps'][0] ?? null;

    if ($step) {
        include(__DIR__ . '/step.php');
    }
    ?>
        </div>

        <div class="messages">
            <p class="msg-error" data-translate="_wrongAns">Desculpa, resposta errada!</p>
            <p class="msg-error-with-hints" data-translate="_wrongHint">Por favor, tenta outra vez.</p>
            <p class="msg-success" data-translate="_correct">Correta!</p>
            <p class="msg-quiz-ended" data-translate="_endQuiz">Este é o fim do quiz. Obrigado!</p>
        </div>

        <div class="buttons">
            <button type="submit" class="btn btn-primary" data-translate="_verifyAns">Verificar Resposta</button>
            <button type="button" class="btn btn-primary next-step-btn"><div data-translate="_next" style="display:inline-flex">Próxima</div> &rarr;</button>
        </div>
    </form>
</main>

<style>
#analysis-methods-quiz {
    position: relative;
    margin-top: 50px;
    border: 2px solid #ccc;
    padding: 40px;
    border-radius: 10px;
    box-shadow: inset -12px -8px 40px #46464620;
}

#analysis-methods-quiz img {
    height: 150px;
    max-width: 100%;
    object-fit: contain;
    display: block;
    margin: 0 auto 20px;
}

#analysis-methods-quiz > header {
    margin-bottom: 40px;
    text-align: center;
}

#analysis-methods-quiz > header > .method-current {
    margin-bottom: 10px;
    font-style: italic;
}

#analysis-methods-quiz .step {
}

#analysis-methods-quiz .step > header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    font-size: 1.3rem;
    margin-bottom: 20px;
}

#analysis-methods-quiz .step-nb {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #bbb;
    color: #fff;
    text-align: center;
    line-height: 32px;
    font-weight: bold;
    font-size: 1.1rem;
}

#analysis-methods-quiz .step-question {
    margin: 0;
}

#analysis-methods-quiz .input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 10px 15px;
    border: 1px solid #bbb;
    border-radius: 5px;
    font-size: 1.2rem;
    transition-duration: 150ms;
}

#analysis-methods-quiz .input:not(:disabled):hover {
    border-color: var(--primary);
}

#analysis-methods-quiz .input:focus {
    outline: 2px solid var(--primary);
}

#analysis-methods-quiz input[type="radio"] {
    width: 20px;
    height: 20px;
    accent-color: var(--primary);
}

#analysis-methods-quiz input:disabled {
    opacity: 0.75;
}

#analysis-methods-quiz .step > ol {
    margin-left: 20px;
}

#analysis-methods-quiz .step li > label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    transition-duration: 150ms;
    border: 1px solid #bbb;
    border-radius: 5px;
    transition-duration: 150ms;
}

#analysis-methods-quiz .step li > label.correct,
#analysis-methods-quiz .step .input.correct {
    background-color: rgb(74 222 128 / 0.5);
}

#analysis-methods-quiz .step li > label.correct > input {
    accent-color: rgb(74 222 128);
}

#analysis-methods-quiz .step input[type="radio"] + span {
    transition-duration: 150ms;
}

#analysis-methods-quiz .step li > label:not(.correct):hover {
    border-color: var(--primary);
}

#analysis-methods-quiz .step li > label:hover,
#analysis-methods-quiz .step label:not(.correct) > input[type="radio"]:checked + span {
    color: var(--primary);
}

#analysis-methods-quiz-step-form {
    position: relative;
}

#analysis-methods-quiz-step-form .messages > p {
    font-weight: bold;
    margin-top: 5px;
    position: absolute;
    width: 100%;
    text-align: center;
    opacity: 0;
    transition-duration: 300ms;
}

#analysis-methods-quiz-step-form .messages > .msg-error,
#analysis-methods-quiz-step-form .messages > .msg-error-with-hints {
    color: #dc2626;
}

#analysis-methods-quiz-step-form .messages > .msg-success {
    color: #16a34a;
}

#analysis-methods-quiz-step-form .messages > .msg-quiz-ended {
    margin-top: 50px;
}

#analysis-methods-quiz-step-form.msg-error .messages > .msg-error,
#analysis-methods-quiz-step-form.msg-error-with-hints .messages > .msg-error-with-hints,
#analysis-methods-quiz-step-form.msg-success .messages > .msg-success,
#analysis-methods-quiz-step-form.quiz-ended .messages > .msg-quiz-ended {
    opacity: 1;
}

#analysis-methods-quiz .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 60px;
    position: relative;
}

#analysis-methods-quiz-step-form.quiz-ended .buttons {
    visibility: hidden;
}

#analysis-methods-quiz button {
    padding: 15px 30px;
}

#analysis-methods-quiz .next-step-btn,
#analysis-methods-quiz-step-form.ready-for-next-step button[type="submit"] {
    display: none;
}

#analysis-methods-quiz-step-form.ready-for-next-step .next-step-btn {
    display: inline-block;
}

#analysis-methods-quiz-step-form .hints-container:not(.visible) {
    display: none;
}

#analysis-methods-quiz-step-form .hints-container > .title {
    font-weight: bold;
    margin-bottom: 5px;
}

#analysis-methods-quiz-step-form .hints-container > ul {
    list-style-type: '💡 ';
    margin-left: 20px;
    font-style: italic;
}

#analysis-methods-quiz .btn > svg {
    width: 16px;
    height: 16px;
}

#analysis-methods-quiz button[data-action="admin-goto-edit-quiz"] {
    position: absolute;
    bottom: -50px;
    right: 0;
    border: 1px solid #bbb;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 10px;
}



@keyframes shakeX {
    from,
    to {
        transform: translate3d(0, 0, 0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translate3d(-10px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translate3d(10px, 0, 0);
    }
}

.shakeX {
    animation-name: shakeX;
    animation-duration: 0.7s;
    animation-fill-mode: both;
}

@media (min-width: 768px) {

    #analysis-methods-quiz img {
        height: 250px;
    }

    #analysis-methods-quiz .step > ol {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 40px;
        row-gap: 10px;
    }
}
</style>
