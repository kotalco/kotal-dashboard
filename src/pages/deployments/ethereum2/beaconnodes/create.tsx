import { useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';

import Layout from '@components/templates/Layout/Layout';
import FormLayout from '@components/templates/FormLayout/FormLayout';
import TextInput from '@components/molecules/TextInput/TextInput';
import Select from '@components/molecules/Select/Select';
import MultiSelectWithInput from '@components/molecules/MultiSelectWithInput/MultiSelectWithInput';
import Heading from '@components/templates/Heading/Heading';
import SelectWithInput from '@components/molecules/SelectWithInput/SelectWithInput';
import { clientOptions } from '@data/ethereum2/clientOptions';
import { networkOptions } from '@data/ethereum2/networkOptions';
import { createBeaconNode } from '@utils/requests/ethereum2/beaconNodes';
import { schema } from '@schemas/ethereum2/beaconNode/create';
import { Ethereum2Client } from '@enums/Ethereum2/Ethereum2Client';
import { BeaconNode, CreateBeaconNode } from '@interfaces/ethereum2/BeaconNode';
import { Ethereum2Network } from '@enums/Ethereum2/Ethereum2Network';
import { handleRequest } from '@utils/helpers/handleRequest';
import { useEthereumNodes } from '@hooks/useEthereumNodes';
import { Deployments } from '@enums/Deployments';
import { NotificationInfo } from '@interfaces/NotificationInfo';

const CreateBeaconNode: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const { nodes } = useEthereumNodes();
  const router = useRouter();

  const activeNodes = nodes
    .filter(({ rpc }) => rpc)
    .map(({ rpcPort, name }) => ({
      label: name,
      value: `http://${name}:${rpcPort}`,
    }));
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
      const notification: NotificationInfo = {
        title: 'Ethereum 2.0 Node has been created',
        message:
          'Node has been created successfully, and will be up and running in few seconds.',
        deploymentName: response.name,
      };
      localStorage.setItem(
        Deployments.beaconnode,
        JSON.stringify(notification)
      );
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
                otherLabel="Other Network"
                error={errors.network?.message}
                options={networkOptions}
                value={field.value}
                name={field.name}
                onChange={field.onChange}
              />
            )}
          />

          {/* Ethereum Endpoint in case of client is Prysm and network is not Mainnet */}
          {client === Ethereum2Client.prysm &&
            network !== Ethereum2Network.mainnet && (
              <Controller
                name="eth1Endpoints"
                control={control}
                render={({ field }) => (
                  <MultiSelectWithInput
                    options={activeNodes}
                    otherLabel="Add more externl nodes"
                    placeholder="Select Ethereum Nodes..."
                    onChange={field.onChange}
                    value={field.value}
                    label="Ethereum Node JSON-RPC Endpoints"
                    helperText="One endpoint per each line"
                    errors={errors}
                    error={errors.eth1Endpoints && field.name}
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
