import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Button } from 'react-bootstrap';
import { Title, Text } from '../../../styled/Text';
import { FormSubmit } from '../../../styled/Forms';
import OwnersFields from '../../../create-multisig/OwnersFields';
import ThresholdsFields from '../../../create-multisig/ThresholdsFields';
import { ownersSchema } from '../../../../utils/schemas/ownersSchema';
import signaturesSchema from '../../../../utils/schemas/signaturesSchema';
import useAPI from '../../../../hooks/useApi';
import { useContractStateContext } from '../../../../store/contractContext';
import { handleError } from '../../../../utils/errorsHandler';
import { convertHexToPrefixedBase58, isHex } from '../../../../utils/helpers';
import { useOperationsDispatchContext } from '../../../../store/operationsContext';

const ContractEditor = ({ onCreate, onCancel }) => {
  const { updateStorage } = useAPI();
  const {
    contractAddress,
    contractInfo: { owners, threshold },
  } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();

  const entities = useMemo(() => {
    return owners.map((owner) => {
      return {
        value: owner.address,
        isPubKey: !owner.address,
      };
    });
  }, [owners]);

  const schema = Yup.object().shape({
    entities: ownersSchema,
    signatures: signaturesSchema,
  });

  const update = async (
    { entities: entitiesPayload, signatures },
    resetForm,
  ) => {
    try {
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

      resetForm({
        values: {
          entities: [{ id: 0, value: '', isPubKey: false }],
          signatures: 1,
        },
      });
      onCreate();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Formik
      initialValues={{
        entities,
        signatures: threshold,
      }}
      validationSchema={schema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, { resetForm }) => {
        await update(values, resetForm);
      }}
    >
      {({
        values,
        touched,
        errors,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
      }) => (
        <Form>
          <div>
            <Title fs="18px">Owners</Title>
            <Text>
              You can edit the contract owners by adding, removing or changing
              their addresses
            </Text>

            <OwnersFields />
          </div>

          <div>
            <Title fs="18px">Thresholds</Title>
            <Text>
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
              style={{ marginRight: '10px' }}
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
