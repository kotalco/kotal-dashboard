import { useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/router';

import Layout from '@components/templates/Layout/Layout';
import FormLayout from '@components/templates/FormLayout/FormLayout';
import TextInput from '@components/molecules/TextInput/TextInput';
import Select from '@components/molecules/Select/Select';
import TextareaWithInput from '@components/molecules/TextareaWithInput/TextareaWithInput';
import Heading from '@components/templates/Heading/Heading';
import SelectWithInput from '@components/molecules/SelectWithInput/SelectWithInput';
import { clientOptions } from '@data/ethereum2/clientOptions';
import { networkOptions } from '@data/ethereum2/networkOptions';
import { createBeaconNode } from '@utils/requests/ethereum2/beaconNodes';
import { schema } from '@schemas/ethereum2/beaconNode/createBeaconNode';
import { BeaconNodeClient } from '@enums/Ethereum2/BeaconNodes/BeaconNodeClient';
import { BeaconNode, CreateBeaconNode } from '@interfaces/ethereum2/BeaconNode';
import { BeaconNodeNetwork } from '@enums/Ethereum2/BeaconNodes/BeaconNodeNetwork';
import { handleRequest } from '@utils/helpers/handleRequest';

const CreateBeaconNode: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isValid, isSubmitting },
  } = useForm<CreateBeaconNode>({ resolver: yupResolver(schema) });
  const [network, client] = watch(['network', 'client']);

  const onSubmit: SubmitHandler<CreateBeaconNode> = async (values) => {
    setServerError('');
    const { error, response } = await handleRequest<BeaconNode>(
      createBeaconNode.bind(undefined, values)
    );

    if (error) {
      setServerError(error);
      return;
    }

    if (response) {
      localStorage.setItem('beaconnode', response.name);
      router.push('/deployments/ethereum2/beaconnodes');
    }
  };

  return (
    <Layout>
      <Heading title="Create New Beacon Node" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          error={serverError}
          isSubmitted={isSubmitted}
          isSubmitting={isSubmitting}
          isValid={isValid}
        >
          {/* Beacon Node Name */}
          <TextInput
            label="Node Name"
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Client */}
          <Controller
            name="client"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Choose a client..."
                label="Client"
                error={errors.client?.message}
                options={clientOptions}
                onChange={field.onChange}
              />
            )}
          />

          {/* Network */}
          <Controller
            name="network"
            control={control}
            render={({ field }) => (
              <SelectWithInput
                placeholder="Choose a network..."
                label="Network"
                error={errors.network?.message}
                options={networkOptions}
                value={field.value}
                name={field.name}
                onChange={field.onChange}
              />
            )}
          />

          {/* Ethereum Endpoint in case of client is Prysm and network is not Mainnet */}
          {client === BeaconNodeClient.prysm &&
            network !== BeaconNodeNetwork.mainnet && (
              <Controller
                name="eth1Endpoints"
                control={control}
                shouldUnregister
                render={({ field }) => (
                  <TextareaWithInput
                    multiple
                    label="Ethereum Node JSON-RPC Endpoints"
                    helperText="One endpoint per each line"
                    error={<ErrorMessage errors={errors} name={field.name} />}
                    value={field.value}
                    name={field.name}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
        </FormLayout>
      </form>
    </Layout>
  );
};

export default CreateBeaconNode;
