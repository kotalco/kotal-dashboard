import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Button from '@components/atoms/Button/Button';
import MultiSelectWithInput from '@components/molecules/MultiSelectWithInput/MultiSelectWithInput';
import useInfiniteRequest from '@hooks/useInfiniteRequest';
import { updateBeaconNode } from '@utils/requests/ethereum2/beaconNodes';
import { BeaconNode, Eth1Endpoints } from '@interfaces/ethereum2/BeaconNode';
import { Ethereum2Client } from '@enums/Ethereum2/Ethereum2Client';
import { handleRequest } from '@utils/helpers/handleRequest';
import {
  requiredSchema,
  optionalSchema,
  onlyOneSchema,
} from '@schemas/ethereum2/beaconNode/ethereum1Endpoint';
import { KeyedMutator } from 'swr';
import { EthereumNode } from '@interfaces/Ethereum/ِEthereumNode';

interface Props extends BeaconNode {
  mutate?: KeyedMutator<{ beaconnode: BeaconNode }>;
}

const BeaconNodeEthereumTab: React.FC<Props> = ({
  name,
  client,
  eth1Endpoints,
  network,
  mutate,
}) => {
  const { data: ethereumNodes, isLoading } =
    useInfiniteRequest<EthereumNode>('/ethereum/nodes');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const activeNodes = ethereumNodes
    .filter(({ rpc }) => rpc)
    .map(({ rpcPort, name }) => ({
      label: name,
      value: `http://${name}:${rpcPort}`,
    }));

  const {
    reset,
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<Eth1Endpoints>({
    resolver: yupResolver(
      client === Ethereum2Client.prysm && network !== 'mainnet'
        ? requiredSchema
        : client === Ethereum2Client.nimbus || client === Ethereum2Client.teku
        ? onlyOneSchema
        : optionalSchema
    ),
  });

  const onSubmit: SubmitHandler<Eth1Endpoints> = async (values) => {
    setSubmitSuccess('');
    setServerError('');
    const { error, response } = await handleRequest<BeaconNode>(
      updateBeaconNode.bind(undefined, name, values)
    );

    if (error) {
      setServerError(error);
      return;
    }

    if (response) {
      mutate?.();
      reset(values);
      setSubmitSuccess('Beacon node has been updated');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-4 py-5 sm:p-6">
        {!isLoading && (
          <Controller
            name="eth1Endpoints"
            control={control}
            defaultValue={eth1Endpoints}
            render={({ field }) => (
              <MultiSelectWithInput
                single={
                  client === Ethereum2Client.nimbus ||
                  client === Ethereum2Client.teku
                }
                options={activeNodes}
                label="Ethereum Node JSON-RPC Endpoints"
                emptyLabel="No Internal Active Nodes"
                helperText="Nodes must have activated JSON-RPC port"
                placeholder={
                  client !== Ethereum2Client.nimbus &&
                  client !== Ethereum2Client.teku
                    ? 'Select nodes...'
                    : 'Select a node...'
                }
                value={field.value}
                errors={errors}
                error={errors.eth1Endpoints && field.name}
                onChange={field.onChange}
                otherLabel={
                  client !== Ethereum2Client.nimbus &&
                  client !== Ethereum2Client.teku
                    ? 'Add external nodes'
                    : 'Use external node'
                }
              />
            )}
          />
        )}
      </div>

      <div className="flex flex-row-reverse items-center px-4 py-3 space-x-2 space-x-reverse bg-gray-50 sm:px-6">
        <Button
          type="submit"
          className="btn btn-primary"
          disabled={!isDirty || isSubmitting}
          loading={isSubmitting}
        >
          Save
        </Button>
        {submitSuccess && <p>{submitSuccess}</p>}
        {serverError && (
          <p aria-label="alert" className="text-sm text-red-600">
            {serverError}
          </p>
        )}
      </div>
    </form>
  );
};

export default BeaconNodeEthereumTab;
