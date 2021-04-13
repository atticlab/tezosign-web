import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { Form as BForm, Button } from 'react-bootstrap';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
// TODO: Research import variants
import * as Yup from 'yup';
import { Text, Bold } from '../components/styled/Text';
// import SelectCustom from '../components/SelectCustom';
import CardMultisigType from '../components/select-multisig/CardMultisigType';
import { bs58Validation } from '../utils/helpers';

const SelectMultisigStyled = styled.section`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 53px auto 0;
  max-width: 1060px;

  @media (${({ theme }) => theme.smDown}) {
    margin-top: 0;
  }
`;

SelectMultisigStyled.Item = styled.div`
  max-width: 480px;

  @media (${({ theme }) => theme.xlDown}) {
    max-width: 450px;
  }

  @media (${({ theme }) => theme.lgDown}) {
    flex: 1 0 100%;
    max-width: 100%;
    margin-bottom: 30px;
  }
`;

const schema = Yup.object({
  address: Yup.string()
    .required('Required')
    .matches('KT1', 'Tezos contract address must start with KT1')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

// const availableContracts = [
//   'KT1fffffffffffffffffffffffffffffffff',
//   'KT1NtGnEjacAkBph7k9HWVrN38PoYjcXTxdY',
//   'KT1cvvvvvvvvvvdvvfdDDvvvvvvvvvvvvvvd',
// ];

const SelectMultisig = () => {
  const history = useHistory();

  return (
    <SelectMultisigStyled>
      <Helmet>
        <title>
          Manage existing XTZ wallet or create a new multisig one with TzSign.
        </title>
        <meta
          name="description"
          content="TzSign is a web-based multisig XTZ wallet: manage a deployed wallet contract or create a new one upon your requests. Choose an option to proceed with your Tezos trip!"
        />
        <meta
          itemProp="name"
          content="Manage existing XTZ wallet or create a new multisig one with TzSign."
        />
        <meta
          itemProp="description"
          content="TzSign is a web-based multisig XTZ wallet: manage a deployed wallet contract or create a new one upon your requests. Choose an option to proceed with your Tezos trip!"
        />
        <meta
          property="og:title"
          content="Manage existing XTZ wallet or create a new multisig one with TzSign."
        />
        <meta
          property="og:description"
          content="TzSign is a web-based multisig XTZ wallet: manage a deployed wallet contract or create a new one upon your requests. Choose an option to proceed with your Tezos trip!"
        />
        <meta
          name="twitter:title"
          content="Manage existing XTZ wallet or create a new multisig one with TzSign."
        />
        <meta
          name="twitter:description"
          content="TzSign is a web-based multisig XTZ wallet: manage a deployed wallet contract or create a new one upon your requests. Choose an option to proceed with your Tezos trip!"
        />
        <meta
          name="keywords"
          content="create Tezos wallet, create XTZ wallet, create multisig Tezos wallet, create multisig XTZ wallet, manage Tezos wallet, manage XTZ wallet"
        />
      </Helmet>

      <SelectMultisigStyled.Item>
        <CardMultisigType
          title="Create a new multisig"
          icon="wallet"
          text={
            <>
              <Text>
                Create a new multisig wallet by declaring owners, signature
                thresholds and more.
              </Text>
              <Text>
                <Bold>Note: </Bold>
                Requires contract deployment cost.
              </Text>
            </>
          }
        >
          <Button as={Link} variant="primary" block to="/create-multisig">
            Create
          </Button>
        </CardMultisigType>
      </SelectMultisigStyled.Item>

      <SelectMultisigStyled.Item>
        <CardMultisigType
          title="Manage an existing multisig"
          icon="cogs"
          text={
            <Text>
              Enter a contract address that has an owner associated with the
              account that is currently connected.
            </Text>
          }
        >
          <Formik
            initialValues={{ address: '' }}
            validationSchema={schema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              history.push(`/multisig/${values.address}`);
            }}
          >
            {/* setFieldValue,  values */}
            {({ isSubmitting, errors, touched }) => (
              <FForm as={BForm}>
                <BForm.Group
                  style={{ marginBottom: '10px', textAlign: 'left' }}
                >
                  <Field
                    as={BForm.Control}
                    type="text"
                    name="address"
                    aria-label="address"
                    placeholder="KT1..."
                    size="sm"
                    isInvalid={!!errors.address && touched.address}
                    isValid={!errors.address && touched.address}
                    style={{ height: 'auto' }}
                  />

                  {/* <SelectCustom */}
                  {/*  options={availableContracts} */}
                  {/*  onChange={(value) => { */}
                  {/*    setFieldValue('address', value.value); */}
                  {/*  }} */}
                  {/*  isInvalid={!!errors.address && touched.address} */}
                  {/*  isValid={!errors.address && touched.address} */}
                  {/*  isTouched={touched.address} */}
                  {/*  placeholder="KT1..." */}
                  {/*  defaultValue={{ */}
                  {/*    label: values.address, */}
                  {/*    value: values.address, */}
                  {/*  }} */}
                  {/* /> */}

                  <ErrorMessage
                    component={BForm.Control.Feedback}
                    style={{ textAlign: 'left' }}
                    name="address"
                    type="invalid"
                  />
                </BForm.Group>
                <Button type="submit" block disabled={isSubmitting}>
                  Manage
                </Button>
              </FForm>
            )}
          </Formik>
        </CardMultisigType>
      </SelectMultisigStyled.Item>
    </SelectMultisigStyled>
  );
};

export default SelectMultisig;
