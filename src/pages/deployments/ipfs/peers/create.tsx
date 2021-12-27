import { useState } from 'react';
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from '@components/templates/Layout/Layout';
import FormLayout from '@components/templates/FormLayout/FormLayout';
import TextInput from '@components/molecules/TextInput/TextInput';
import Checkbox from '@components/molecules/CheckBox/CheckBox';
import Heading from '@components/templates/Heading/Heading';
import { createIPFSPeer } from '@utils/requests/ipfs/peers';
import { schema } from '@schemas/ipfs/peers/createPeer';
import { CreatePeer, Peer } from '@interfaces/ipfs/Peer';
import { IPFSConfigurationProfile } from '@enums/IPFS/Peers/IPFSConfigurationProfile';
import { initProfilesOptions } from '@data/ipfs/peers/initProfilesOptions';
import { handleRequest } from '@utils/helpers/handleRequest';
import { Deployments } from '@enums/Deployments';

const CreateIPFSPeerPage: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isValid, isSubmitting },
  } = useForm<CreatePeer>({
    resolver: yupResolver(schema),
    defaultValues: {
      initProfiles: [IPFSConfigurationProfile.defaultDatastore],
    },
  });

  const onSubmit: SubmitHandler<CreatePeer> = async (values) => {
    setServerError('');
    const { error, response } = await handleRequest<Peer>(
      createIPFSPeer.bind(undefined, values)
    );

    if (error) {
      setServerError(error);
      return;
    }

    if (response) {
      localStorage.setItem(Deployments.peer, response.name);
      router.push('/deployments/ipfs/peers');
    }
  };

  const initProfilesError = errors.initProfiles as FieldError | undefined;

  return (
    <Layout>
      <Heading title="Create New Peer" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          error={serverError}
          isSubmitted={isSubmitted}
          isSubmitting={isSubmitting}
          isValid={isValid}
        >
          {/* Peer Name */}
          <TextInput
            label="Peer Name"
            error={errors.name?.message}
            {...register('name')}
          />

          {/* <!-- configuration profiles --> */}
          <Checkbox
            options={initProfilesOptions}
            label="Initial Configuration Profiles:"
            error={initProfilesError?.message}
            {...register('initProfiles')}
          />
        </FormLayout>
      </form>
    </Layout>
  );
};

export default CreateIPFSPeerPage;
