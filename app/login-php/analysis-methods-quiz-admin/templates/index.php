<button class="btn btn-primary float-right mb-4" data-action="create" data-translate="_createQuiz"></button>

<table class="table">
    <thead>
      <tr>
          <th>ID</th>
          <th data-translate="_currentType"></th>
          <th data-translate="_methodType"></th>
          <th data-translate="_difficulty"></th>
          <th data-translate="_nbSteps"></th>
          <th></th>
      </tr>
    </thead>
    <tbody>
        <?php while($quiz = mysqli_fetch_assoc($result)) : ?>
            <tr>
                <th>
                    <span class="only-on-mobile">ID</span>
                    <?php echo $quiz['id'] ?></th>
                <td>
                    <span class="only-on-mobile" 
                    data-translate="_currentType"></span>
                    <?php echo $quiz['current_type']; ?></td>
                <td>
                    <span class="only-on-mobile"data-translate="_methodType"></span>
                    <?php echo $quiz['method_type']; ?></td>
                <td>
                    <span class="only-on-mobile"data-translate="_difficulty"></span>

                    <input type="range" step="1" min="1" max="3" disabled value="<?php echo $quiz['difficulty']; ?>" />
                </td>
                <td>
                    <span class="only-on-mobile"  data-translate="_nbSteps"> </span>
                    <?php echo $quiz['step_count']; ?></td>
                <td>
                    <button class="btn btn-info" data-action="edit" data-id="<?php echo $quiz['id'] ?>" data-translate="_editQuiz"></button>
                    <button class="btn text-danger float-right" data-action="delete" data-id="<?php echo $quiz['id'] ?>">
                        <i class="fa fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        <?php endwhile; ?>
    </tbody>
</table>

<style>
    #section-am-quiz-admin .only-on-mobile {
        display: none;
    }

    @media (max-width: 767px) {
        #section-am-quiz-admin .only-on-mobile {
            display: inline;
        }

        #section-am-quiz-admin div[data-id="view"] .btn-primary {
            float: none !important;
            margin: 0 auto;
            display: block;
        }

        #section-am-quiz-admin div[data-id="view"] thead {
            display: none;
        }

        
        #section-am-quiz-admin div[data-id="view"] tr {
            display: block;
            margin-bottom: 50px;
        }

        #section-am-quiz-admin div[data-id="view"] th,
        #section-am-quiz-admin div[data-id="view"] td {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

    }
</style>
