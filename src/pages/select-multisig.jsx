import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Helmet from 'react-helmet';
import styled from 'styled-components';
// eslint-disable-next-line no-unused-vars
import { Form as BForm, InputGroup, Button } from 'react-bootstrap';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
// TODO: Research import variants
import * as Yup from 'yup';
// import SelectCustom from '../components/SelectCustom';
import CardMultisigType from '../components/CardMultisigType';
import { bs58Validation } from '../utils/helpers';

const Bold = styled.span`
  font-weight: 800;
`;

const Regular = styled.span`
  font-weight: 400;
`;

const SelectMultisigStyled = styled.section`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 53px;

  @media (${({ theme }) => theme.smDown}) {
    margin-top: 0;
  }
`;

const schema = Yup.object({
  address: Yup.string()
    .trim()
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
          Manage an existing XTZ wallet or create a new multisig one with
          TzSign.
        </title>
        <meta
          name="description"
          content="TzSign is a web-based multisig XTZ wallet: manage a deployed wallet contract or create a new one upon your requests. Choose an option to proceed with your Tezos trip!"
        />
        <meta
          itemProp="name"
          content="Manage an existing XTZ wallet or create a new multisig one with TzSign."
        />
        <meta
          itemProp="description"
          content="TzSign is a web-based multisig XTZ wallet: manage a deployed wallet contract or create a new one upon your requests. Choose an option to proceed with your Tezos trip!"
        />
        <meta
          property="og:title"
          content="Manage an existing XTZ wallet or create a new multisig one with TzSign."
        />
        <meta
          property="og:description"
          content="TzSign is a web-based multisig XTZ wallet: manage a deployed wallet contract or create a new one upon your requests. Choose an option to proceed with your Tezos trip!"
        />
        <meta
          name="twitter:title"
          content="Manage an existing XTZ wallet or create a new multisig one with TzSign."
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

      <CardMultisigType
        title="Create a new multisig"
        icon="wallet"
        text={
          <>
            Create a new multisig wallet by declaring owners, signature
            thresholds and more. <br />
            <Bold>Note: </Bold>
            <Regular>Requires contract deployment cost.</Regular>
          </>
        }
      >
        <Button as={Link} variant="primary" size="lg" to="/create-multisig">
          Create
        </Button>
      </CardMultisigType>

      <CardMultisigType
        title="Manage an existing multisig"
        icon="cogs"
        text="Enter a contract address that has an owner associated with the account
        that is currently connected."
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
            <FForm as={BForm} style={{ maxWidth: '380px', margin: '0 auto' }}>
              <BForm.Group style={{ marginBottom: '10px', textAlign: 'left' }}>
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
              <Button type="submit" size="lg" disabled={isSubmitting}>
                Manage
              </Button>
            </FForm>
          )}
        </Formik>
      </CardMultisigType>
    </SelectMultisigStyled>
  );
};

export default SelectMultisig;
