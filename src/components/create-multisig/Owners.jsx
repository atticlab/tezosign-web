import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Card from '../styled/Card';
import Text from '../styled/Text';
import OwnersFields from './OwnersFields';
import useAddressRevealCheck from '../../hooks/useAddressRevealCheck';
import { cacheTest, ownersSchema } from '../../utils/schemas/ownersSchema';

const Owners = ({ onSubmit }) => {
  const { isAddressRevealed } = useAPI();
  const testIsAddressRevealed = async (val) => {
    if (!val || val.length !== 36 || !bs58Validation(val)) return false;
    const resp = await isAddressRevealed(val);
    return resp.data.revealed;
  };
  const testAddress = useRef(cacheTest(testIsAddressRevealed));

  const schema = Yup.object().shape({
    entities: ownersSchema(testAddress),
  });

  return (
    <Card.Body>
      <Text modifier="md">
        First, provide the accounts that will be controlling and administering
        the funds associated with this multisig wallet. <br />
        You can provide either Tezos addresses or accounts&#39; public keys.
        Public keys may be convenient to use if account&#39;s address is
        unrevealed. A public key must be either base58 or ED25519 hex format.
      </Text>

      <Formik
        initialValues={{
          entities: [{ id: 0, value: '', isPubKey: false }],
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values.entities.map((entity) => entity.value));
          setSubmitting(false);
        }}
      >
        {({
          values,
          touched,
          errors,
          setFieldValue,
          isSubmitting,
          validateForm,
        }) => (
          <Form>
            <OwnersFields
              values={values}
              touched={touched}
              errors={errors}
              setFieldValue={setFieldValue}
              validateForm={validateForm}
            />

            <div style={{ textAlign: 'right' }}>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card.Body>
  );
};

Owners.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Owners;
