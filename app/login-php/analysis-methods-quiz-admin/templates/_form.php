<form method="post" id="amq-admin-form">

    <div class="amq-admin-form-state-msg state-success">Form Saved!</div>
    <div class="amq-admin-form-state-msg state-error">Oops, could not save form :(</div>

    <div class="input-grop-row">
        <div class="input-group">
            <label for="amq-current-type" data-translate='_currentType'></label>
            <select required name="current_type" id="amq-current-type">
                <option value="AC" <?php echo($quiz['current_type'] ?? '') === 'AC' ? 'selected' : '' ?>>AC</option>
                <option value="DC" <?php echo($quiz['current_type'] ?? '') === 'DC' ? 'selected' : '' ?>>DC</option>
            </select>
        </div>

        <div class="input-group">
            <label for="amq-method-type" data-translate="_methodType"></label>
            <select required name="method_type" id="amq-method-type">
                <option value="MTN" <?php echo($quiz['method_type'] ?? '') === 'MTN' ? 'selected' : '' ?>>MTN</option>
                <option value="MCM" <?php echo($quiz['method_type'] ?? '') === 'MCM' ? 'selected' : '' ?>>MCM</option>
                <option value="MCR" <?php echo($quiz['method_type'] ?? '') === 'MCR' ? 'selected' : '' ?>>MCR</option>
            </select>
        </div>

        <div class="input-group">
            <label for="amq-difficulty" data-translate="_difficultyType"></label>
            <input type="range" required name="difficulty" min="1" max="3" step="1" value="<?php echo $quiz['difficulty'] ?? 2 ?>" id="amq-difficulty">
        </div>

    </div>

    <div class="input-grop-row">
        <div class="input-group">
            <label for="amq-netlist">Netlist</label>

            <div>
                <?php if ($quiz['netlist'] ?? ''): ?>
                <textarea readonly><?php echo $quiz['netlist'] ?></textarea>
                <?php endif; ?>
                <input type="file" name="netlist" />
            </div>
        </div>

        <div class="input-group">
            <label for="amq-image" data-translate="_image"></label>

            <div>
                <?php if ($quiz['image'] ?? ''): ?>
                    <img src="data:image/png;base64, <?php echo $quiz['image'] ?>" width="100%" />
                <?php endif; ?>

                <input type="file" name="image" />
            </div>
        </div>
    </div>

    <h5 class="text-center mt-4 mb-0" data-translate="_steps"></h5>

    <div class="step-list" data-step-count="<?php echo count($quiz['steps']) ?>">
        <?php
            foreach ($quiz['steps'] as $i => $step):

                $step['hints'] = ($step['hints'] ?? []) ?: [''];
                $step['options'] = ($step['options'] ?? []) ?: ['', '', '', ''];
                ?>
        <div class="step">
            <div>
                <div class="step-nb-label"> <div data-translate="_stepQuiz" style="display:inline-flex"></div><span class="step-nb"><?php echo $i + 1 ?></span></div>

                <button data-action="remove-step">
                    <i class="fa fa-trash-alt"></i>
                </button>
            </div>

            <div>
                <label for="amq-step-s<?php echo $i ?>-type" data-translate="_type">Type of Answer</label>
                <select required class="step-type" name="steps[<?php echo $i ?>][type]" id="amq-step-s<?php echo $i ?>-type">
                    <option value="free_numeric" <?php echo($step['type'] ?? '') === 'free_numeric' ? 'selected' : '' ?> data-translate="_freeNum">Free (numeric)</option>
                    <option value="multiple" <?php echo($step['type'] ?? '') === 'multiple' ? 'selected' : '' ?> data-translate="_multiple">Multiple</option>
                </select>
            </div>

            <div>
                <label for="amq-step-s<?php echo $i ?>-theme" data-translate="_theme"></label>
                <select required name="steps[<?php echo $i ?>][theme]" id="amq-step-s<?php echo $i ?>-theme">
                    <option value="" disabled <?php echo !($step['theme'] ?? '') ? 'selected' : '' ?>></option>
                    <option value="nodes" <?php echo($step['theme'] ?? '') === 'nodes' ? 'selected' : '' ?> data-translate="_fundamentals_N"></option>
                    <option value="branches"  <?php echo($step['theme'] ?? '') === 'branches' ? 'selected' : '' ?> data-translate="_fundamentals_R"></option>
                    <option value="meshes"  <?php echo($step['theme'] ?? '') === 'meshes' ? 'selected' : '' ?> data-translate="_fundamentals_M"></option>
                    <option value="equations"  <?php echo($step['theme'] ?? '') === 'equations' ? 'selected' : '' ?> data-translate="_fundamentals_E"></option>
                    <option value="currents_and_voltages"  <?php echo($step['theme'] ?? '') === 'currents_and_voltages' ? 'selected' : '' ?> data-translate="_fundamentals_C_T">Currents and Voltages</option>
                    <option value="other"  <?php echo($step['theme'] ?? '') === 'other' ? 'selected' : '' ?> data-translate="_other"></option>
                </select>
            </div>

            <div class="input-group">
                <label for="amq-image" data-translate="_image"></label>

                <div>
                    <?php if (isset($step['step_image'])): ?>
                        <div class="step-img">
                            <img src="data:image/png;base64, <?php echo $step['step_image'] ?>" width="100%" />
                             <button class="btn-clear-img" type="button" data-action="remove-step-img" data-translate="_removeImage"></button>
                            <input type="hidden" name="steps[<?php echo $i ?>][remove_img]" value="0" class="input-remove-img" />
                            <input type="hidden" name="steps[<?php echo $i ?>][image_encoded]" value="<?php echo $step['step_image'] ?>" />
                        </div>
                    <?php endif; ?>

                    <input type="file" name="steps[<?php echo $i ?>][step_image]" />
                </div>
            </div>

            <div>
                <label for="amq-step-s<?php echo $i ?>-question" data-translate="_question"></label>

                <textarea required name="steps[<?php echo $i ?>][question]" id="amq-step-s<?php echo $i ?>-question"><?php echo $step['question'] ?></textarea>
            </div>

            <div class="step-options" style="display: <?php echo ($step['type'] === 'multiple') ? 'block' : 'none' ?>">
                <label for="amq-step-s<?php echo $i ?>-options-o0" data-translate="_options"></label>

                <div class="step-option-list option-list">
                  <?php foreach ($step['options'] as $o => $option): ?>
                      <div class="step-option option">

                          <input type="text" name="steps[<?php echo $i ?>][options][<?php echo $o ?>]" id="amq-step-s<?php echo $i ?>-options-o<?php echo $o ?>" placeholder="Option #<?php echo $o + 1 ?>" value="<?php echo $option ?>" />

                          <button type="button" data-action="remove-option">
                            <i class="fa fa-minus-circle"></i>
                          </button>
                      </div>

                      <?php
                            // show add option button if this is the last option
                            if ($o === count($step['options']) - 1):
                                ?>
                            <button type="button" data-action="add-option">
                                <i class="fa fa-plus-circle"></i>
                            </button>
                      <?php endif; ?>
                  <?php endforeach; ?>
                </div>
            </div>

            <div class="step-answer">
                <label for="amq-step-s<?php echo $i ?>-answer" data-translate="_answer"></label>

                <input type="<?php echo $step['type'] === 'free_numeric' ? 'number' : 'text' ?>" step="0.01" required name="steps[<?php echo $i ?>][answer]" id="amq-step-s<?php echo $i ?>-answer" value="<?php echo $step['answer'] ?>" />

                <div class="error-msg hidden" data-translate="_answerError">Answer does not exist in options</div>
            </div>

            <div>
                <label for="amq-step-s<?php echo $i ?>-hints-h0" data-translate="_hints"></label>

              <div class="step-hint-list option-list">
                <?php foreach ($step['hints'] as $h => $hint): ?>
                <div class="step-hint option">
                    <input type="text" name="steps[<?php echo $i ?>][hints][<?php echo $h ?>]" id="amq-step-s<?php echo $i ?>-hints-h<?php echo $h ?>" placeholder="Hint #<?php echo $h + 1 ?>" value="<?php echo $hint ?>" />

                     <button type="button" data-action="remove-option">
                        <i class="fa fa-minus-circle"></i>
                        </button>
                </div>
                 <?php
                    // show add hint button if this is the last hint
                    if ($h === count($step['hints']) - 1):
                        ?>
                    <button type="button" data-action="add-option">
                        <i class="fa fa-plus-circle"></i>
                    </button>
                    <?php endif; ?>
                <?php endforeach; ?>
              </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>

    <div class="footer-btns">
        <button type="button" data-action="add-step">
        <i class="fa fa-plus-circle" style="display:inline-flex"></i>
        <div data-translate="_addStep"></div>
        </button>
            <div id="btns-for-update" class="submit-btns hidden">
                <button type="button" data-action="save-and-continue" class="btn"data-translate="_save_cont">Guardar e continuar a Editar</button>
                <button type="submit" class="btn btn-primary" data-translate="_save">Guardar</button>
            </div>
        <button id="btn-for-create" type="submit" class="btn btn-primary hidden" data-translate="_createQuiz">Criar</button>
    </div>
</form>

<style>
    #amq-admin-form {
        margin: 40px 0;
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    #amq-admin-form .input-grop-row {
        display: flex;
        flex-direction: column;
        gap: 50px;
        align-items: flex-start;
    }

    #amq-admin-form .input-group {
        display: flex;
        align-items: center;
    }

    #amq-admin-form label {
        min-width: 150px;
        padding: 5px 0 0;
        cursor: pointer;
    }

    #amq-admin-form .input-group > div {
        width: 100%;
    }

    #amq-admin-form input, #amq-admin-form textarea, #amq-admin-form select, #amq-admin-form button {
        border-radius: 5px;
        accent-color: var(--primary);
        border: 1px solid #bbb;
        padding: 10px 15px;
    }

     #amq-admin-form input, #amq-admin-form textarea, #amq-admin-form select {
        width: 100%;
    }

    #amq-admin-form input, #amq-admin-form textarea {
        background-color: #fff;
    }

    #amq-admin-form select, #amq-admin-form button {
        cursor: pointer;
    }

        #amq-admin-form .footer-btns {
            display: flex;
            justify-content: space-between;
        }

        #amq-admin-form .submit-btns {
            display: flex;
            gap: 40px;
            height: 100%;
        }

        #amq-admin-form .submit-btns > button {
            min-width: 250px;
            height: 100%;
        }

        #amq-admin-form .footer-btns > button {
            width: 30%;
            height: 100%;
        }

    #amq-admin-form input:not([type="range"]):focus, #amq-admin-form select:focus {
        outline: 2px solid var(--primary);
    }

    #amq-admin-form button > svg {
        width: 20px;
        height: 20px;
        pointer-events: none;
    }

    #amq-admin-form .step-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 50px;
    }

    #amq-admin-form button[data-action="add-step"] {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    #amq-admin-form .step-list > .step {
        background-color: #f3f4f6;
        padding: 25px 30px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }

    #amq-admin-form .step .step-nb-label {
        background-color: var(--primary);
        color: #fff;
        padding: 2px 10px;
        border-radius: 5px;
        float: left;
    }

    #amq-admin-form .step button[data-action="remove-step"] {
        background: none;
        float: right;
        color: var(--danger);
        padding: 5px 10px;
    }

    #amq-admin-form .step-list[data-step-count="1"] .step button[data-action="remove-step"] {
        display: none;
    }

    #amq-admin-form .option-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    #amq-admin-form .option {
        display: flex;
        gap: 20px;
    }

    #amq-admin-form .option > input {
        width: 80%;
    }

    #amq-admin-form .option > button {
        width: auto;
    }


    /* hide remove option button for first option (hints) */
    /* #amq-admin-form .step-hint-list > .option:nth-child(1) button[data-action="remove-option"] {
        display: none;
    } */

    /* hide remove option button for first two options */
    #amq-admin-form .step-option-list > .option:nth-child(1) button[data-action="remove-option"],
    #amq-admin-form .step-option-list > .option:nth-child(2) button[data-action="remove-option"] {
        display: none;
    }

    #amq-admin-form .error-msg {
        color: var(--danger);
        font-size: 14px;
        padding: 5px;
        font-weight: bold;
    }

    #amq-admin-form .btn-clear-img {
        margin: 10px 0 15px;
        color: var(--danger);
        background: none;
        padding: 0;
        border: 0;
        font-size: 80%;
        text-decoration: underline;
    }

        .amq-admin-form-state-msg {
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            text-align: center;
            position: fixed;
            bottom: -50px;
            right: 20px;
            z-index: 10;
            opacity: 0;
            transition-duration: 0.5s;
        }

        .amq-admin-form-state-msg.state-success {
            background-color: var(--success);
        }

          .amq-admin-form-state-msg.state-error {
            background-color: var(--danger);
        }

        .amq-admin-form-state-msg.active {
            opacity: 1;
            bottom: 20px;
        }

    @media (min-width: 768px) {

        #amq-admin-form .step-list > .step {
            width: 45%;
        }

        #amq-admin-form .input-grop-row {
            flex-direction: row;
        }
    }
</style>
