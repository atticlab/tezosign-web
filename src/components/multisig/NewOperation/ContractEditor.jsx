import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Button } from 'react-bootstrap';
import Title from '../../styled/Title';
import Text from '../../styled/Text';
import { FormSubmit } from '../../styled/Forms';
import OwnersFields from '../../create-multisig/OwnersFields';
import ThresholdsFields from '../../create-multisig/ThresholdsFields';
import { ownersSchema, cacheTest } from '../../../utils/schemas/ownersSchema';
import signaturesSchema from '../../../utils/schemas/signaturesSchema';
import useAddressRevealCheck from '../../../hooks/useAddressRevealCheck';
import useAPI from '../../../hooks/useApi';
import { useContractStateContext } from '../../../store/contractContext';
import { handleError } from '../../../utils/errorsHandler';
import { convertHexToPrefixedBase58, isHex } from '../../../utils/helpers';
import { useOperationsDispatchContext } from '../../../store/operationsContext';

const ContractEditor = ({ onCreate, onCancel }) => {
  const { updateStorage } = useAPI();
  const {
    contractAddress,
    contractInfo: { owners, threshold },
  } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();
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

  const update = async (setSubmitting, fields) => {
    try {
      setSubmitting(true);

      const { entities: entitiesPayload, signatures } = fields;
      const payload = {
        entities: entitiesPayload.map((entity) =>
          isHex(entity.value)
            ? convertHexToPrefixedBase58(entity.value)
            : entity.value,
        ),
        threshold: Number(signatures),
      };

      const resp = await updateStorage(contractAddress, payload);
      await setOps((prev) => {
        return [resp.data, ...prev];
      });

      onCreate();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        entities,
        signatures: threshold,
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        update(setSubmitting, values);
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
              options={values.entities.map((_, index) => ({
                value: index + 1,
                label: index + 1,
              }))}
              defaultValue={{ label: threshold, value: threshold }}
              touched={touched}
              errors={errors}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
          </div>

          <FormSubmit>
            <Button
              variant="danger"
              style={{ marginRight: '20px' }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Confirm
            </Button>
          </FormSubmit>
        </Form>
      )}
    </Formik>
  );
};

ContractEditor.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ContractEditor;
