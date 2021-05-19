import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { Text } from '../styled/Text';
import OwnersFields from './OwnersFields';
import { ownersSchema } from '../../utils/schemas/ownersSchema';

const Owners = ({ onSubmit }) => {
  const schema = Yup.object().shape({
    entities: ownersSchema,
  });

  return (
    <>
      <Text>
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
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values.entities.map((entity) => entity.value));
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <OwnersFields />

            <div style={{ textAlign: 'right' }}>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

Owners.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Owners;
