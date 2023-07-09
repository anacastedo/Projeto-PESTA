<div class="step">

    <!--Imagem-->
    <?php if ($step['step_image'] ?? null): ?>
        <img src="data:image/png;base64, <?php echo $step['step_image'] ?>">
    <?php endif ?>

    <header>
        <span class="step-nb"><?php echo $stepNb ?? 1 ?></span>
        <span class="step-question"><?php echo $step['question'] ?></span>
    </header>

    <input type="hidden" name="step_nb" value="<?php echo $internalStepNb ?? $stepNb ?? 1 ?>" />

    <!--Espaço para a resposta / escolha múltipla-->
    <?php if ($step['type'] === 'multiple' && isset($step['options'])): ?>
        <ol>
        <?php foreach ($step['options'] as $option): ?>
            <li>
                <label>
                    <input type="radio" name="answer" value="<?php echo $option ?>" required />
                    <span><?php echo $option ?></span>
                </label>
            </li>
        <?php endforeach ?>
        </ol>
    <?php else: ?>
        <input class="input" type="<?php echo $step['type'] === 'free_numeric' ? 'number' : 'text' ?>" <?php echo ($step['type'] === 'free_numeric') ? 'step="0.01"' : '' ?> placeholder="Escreva a resposta aqui" name="answer" required />
    <?php endif ?>
</div>

<div class="hints-container">
    <div class="title">Hints:</div>
    <ul></ul>
</div>
