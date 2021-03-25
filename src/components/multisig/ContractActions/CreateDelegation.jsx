// useState
import React from 'react';
import PropTypes from 'prop-types';
import { Form as BForm, InputGroup, Button } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
// import SelectCustom from '../../SelectCustom';
// import { TextAccent, BreakTxt } from '../../styled/Text';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import { bs58Validation } from '../../../utils/helpers';
import useAPI from '../../../hooks/useApi';
import { useOperationsDispatchContext } from '../../../store/operationsContext';
import { useContractStateContext } from '../../../store/contractContext';
import { handleError } from '../../../utils/errorsHandler';

const schema = Yup.object({
  baker: Yup.string()
    .required(
      "This field cannot be empty. If you want to undelegate, click the button 'Undelegate'.",
    )
    .matches('tz1|tz2|tz3', 'Tezos baker address must start with tz1, tz2, tz3')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

// const delegatingTo = 'tz1Ldzz6k1BHdhuKvAtMRX7h5kJSMHESMHLC';

// const bakers = [
//   {
//     value: 'tz1123333333333333322222222222222222',
//     label: 'Test baker 1',
//   },
//   {
//     value: 'tz1123333333333333326666666666666666',
//     label: 'Test baker 2',
//   },
// ];

const CreateDelegation = ({ onCreate, onCancel }) => {
  // const [alias, setAlias] = useState('');
  const { sendOperation } = useAPI();
  const { contractAddress } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();
  const createDelegation = async (baker, setSubmitting) => {
    try {
      setSubmitting(true);
      const newDelegation = await sendOperation({
        contract_id: contractAddress,
        type: 'delegation',
        to: baker,
      });
      await setOps((prev) => {
        return [newDelegation.data, ...prev];
      });
      onCreate();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* <div style={{ marginBottom: '20px' }}> */}
      {/*  <FormLabel as="p" style={{ marginBottom: '0' }}> */}
      {/*    Currently delegating to: */}
      {/*  </FormLabel> */}
      {/*  <TextAccent> */}
      {/*    <BreakTxt>{delegatingTo}</BreakTxt> */}
      {/*  </TextAccent> */}
      {/* </div> */}

      <Formik
        initialValues={{ baker: '' }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) =>
          createDelegation(values.baker, setSubmitting)
        }
      >
        {({
          // setFieldValue,
          handleBlur,
          handleChange,
          isSubmitting,
          errors,
          touched,
          setSubmitting,
        }) => (
          <Form>
            <BForm.Group controlId="baker" style={{ marginBottom: 0 }}>
              <FormLabel>Delegate to baker address</FormLabel>
              <InputGroup>
                <Field
                  as={BForm.Control}
                  type="text"
                  name="baker"
                  aria-label="baker"
                  placeholder="tz1..."
                  isInvalid={!!errors.baker && touched.baker}
                  isValid={!errors.baker && touched.baker}
                  onChange={(value) => {
                    handleChange(value);
                    // setAlias('');
                  }}
                  onBlur={handleBlur}
                />
                {/* <InputGroup.Append> */}
                {/*  <SelectCustom */}
                {/*    options={bakers} */}
                {/*    displayValue={false} */}
                {/*    onChange={(value) => { */}
                {/*      setFieldValue('baker', value.value); */}
                {/*      setAlias(value.label); */}
                {/*    }} */}
                {/*  /> */}
                {/* </InputGroup.Append> */}

                <ErrorMessage
                  name="baker"
                  component={BForm.Control.Feedback}
                  type="invalid"
                />
              </InputGroup>

              {/* <BForm.Text> */}
              {/*  <TextAccent>{alias}</TextAccent> */}
              {/* </BForm.Text> */}
            </BForm.Group>

            <FormSubmit>
              <Button
                variant="danger"
                style={{ marginRight: '10px' }}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="info"
                style={{ marginRight: '10px' }}
                disabled={isSubmitting}
                onClick={() => createDelegation(undefined, setSubmitting)}
              >
                Undelegate
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Delegate
              </Button>
            </FormSubmit>
          </Form>
        )}
      </Formik>
    </div>
  );
};

CreateDelegation.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateDelegation;
