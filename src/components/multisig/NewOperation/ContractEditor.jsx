/* eslint-disable no-unused-vars */
import React, { useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Button } from 'react-bootstrap';
import { FlexCenter } from '../../styled/Flex';
import Title from '../../styled/Title';
import Text from '../../styled/Text';
import OwnersFields from '../../create-multisig/OwnersFields';
import ThresholdsFields from '../../create-multisig/ThresholdsFields';
import { ownersSchema, cacheTest } from '../../create-multisig/ownersSchema';
import signaturesSchema from '../../create-multisig/signaturesSchema';
import useAddressRevealCheck from '../../create-multisig/useAddressRevealCheck';
import { useContractStateContext } from '../../../store/contractContext';

const ContractEditor = () => {
  const {
    contractInfo: { owners, threshold },
  } = useContractStateContext();
  const { testIsAddressRevealed } = useAddressRevealCheck();
  const testAddress = useRef(cacheTest(testIsAddressRevealed));

  const entities = useMemo(() => {
    return owners.map((owner, index) => {
      return {
        id: index,
        value: owner.address,
        isPubKey: !owner.address,
      };
    });
  }, [owners]);

  const schema = Yup.object().shape({
    entities: ownersSchema(testAddress),
    signatures: signaturesSchema,
  });

  return (
    <Formik
      initialValues={{
        entities,
        signatures: threshold,
      }}
      validationSchema={schema}
      onSubmit={(values, helpers) => {
        console.log(values);
        console.log(helpers);
      }}
    >
      {({
        values,
        touched,
        errors,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        validateForm,
      }) => (
        <Form>
          <div>
            <Title modifier="xs" fw="400">
              Owners
            </Title>
            <Text modifier="sm">
              You can edit the contract owners by adding, removing or changing
              their addresses
            </Text>

            <OwnersFields
              values={values}
              touched={touched}
              errors={errors}
              setFieldValue={setFieldValue}
              validateForm={validateForm}
            />
          </div>

          <div>
            <Title modifier="xs" fw="400">
              Thresholds
            </Title>
            <Text modifier="sm">
              Edit the amount of signatures required to confirm operations
            </Text>

            <ThresholdsFields
              options={
                !errors.entities && touched.threshold
                  ? values.entities.map((_, index) => ({
                      value: index + 1,
                      label: index + 1,
                    }))
                  : new Array(threshold).map((__, index) => ({
                      value: index + 1,
                      label: index + 1,
                    }))
              }
              defaultValue={threshold}
              touched={touched}
              errors={errors}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
          </div>

          <FlexCenter>
            <Button variant="danger" style={{ marginRight: '20px' }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Deploy
            </Button>
          </FlexCenter>
        </Form>
      )}
    </Formik>
  );
};

export default ContractEditor;
