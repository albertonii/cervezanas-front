import InputLabel from '../../common/InputLabel';
import UpdBeerMasterAnswers from './UpdBeerMasterAnswers';
import { useTranslations } from 'next-intl';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  IUpdBeerMasterQuestionFormData,
  IUpdModalExperienceBeerMasterFormData,
} from '../../../../../lib/types';
import { DeleteButton } from '../../common/DeleteButton';
import { Button } from '../../common/Button';

const emptyQuestion: IUpdBeerMasterQuestionFormData = {
  question: '',
  answers: [],
  experience_id: '',
};

interface Props {
  form: UseFormReturn<IUpdModalExperienceBeerMasterFormData, any>;
}

export const UpdBeerMasterSection = ({ form }: Props) => {
  const t = useTranslations();

  const { control, getValues } = form;
  const questionId = getValues('id');

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control,
  });

  const handleRemoveQuestion = (index: number) => {
    remove(index);
  };

  const handleAddQuestion = () => {
    append(emptyQuestion);
  };

  return (
    <section id="Question" className="space-y-4">
      {fields.map((field, index) => (
        <fieldset
          key={field.id}
          className="relative flex-auto space-y-4 pt-6 mt-4 rounded-md border-2 border-dotted border-beer-softBlondeBubble p-4"
        >
          <div className="flex flex-row items-end">
            <InputLabel
              form={form}
              label={`questions.${index}.question`}
              labelText={`${index + 1} ${t('question')}`}
              registerOptions={{
                required: true,
              }}
              placeholder={t('input_questions_question_placeholder')}
            />

            <div className="ml-4">
              <DeleteButton onClick={() => handleRemoveQuestion(index)} />
            </div>
          </div>

          {/* Multiple inputs that are the possible answers to the question */}
          <UpdBeerMasterAnswers
            form={form}
            index={index}
            questionId={questionId}
          />
        </fieldset>
      ))}

      <Button class="" primary medium onClick={() => handleAddQuestion()}>
        {t('question_add')}
      </Button>
    </section>
  );
};
