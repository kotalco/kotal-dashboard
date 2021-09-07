import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { Tab } from '@headlessui/react';

import { fetcher } from '@utils/axios';
import {
  IPFSClusterPeer,
  UpdateIPFSClusterPeer,
} from '@interfaces/ipfs/IPFSClusterPeer';
import {
  useClusterPeer,
  updateClusterPeer,
} from '@utils/requests/ipfs/clusterPeers';
import { tabTitles } from '@data/ipfs/clusterPeers/tabTitles';
import ProtocolDetails from '@components/organisms/ProtocolDetails/ProtocolDetails';
import LoadingIndicator from '@components/molecules/LoadingIndicator/LoadingIndicator';
import Layout from '@components/templates/Layout/Layout';
import Heading from '@components/templates/Heading/Heading';
import Tabs from '@components/organisms/Tabs/Tabs';
import Security from '@components/organisms/IPFS/ClusterPeer/Security/Security';
import Peers from '@components/organisms/IPFS/ClusterPeer/Peers/Peers';
import Resources from '@components/organisms/Resources/Resources';
import DeleteDeployment from '@components/organisms/DeleteDeployment/DeleteDeployment';
import { getLabel } from '@utils/helpers/getLabel';
import { consensusOptions } from '@data/ipfs/clusterPeers/consensusOptions';

interface Props {
  initialClusterpeer?: IPFSClusterPeer;
}

const ClusterPeerDetailsPage: React.FC<Props> = ({ initialClusterpeer }) => {
  const { isFallback } = useRouter();
  const { data: clusterpeer, mutate } = useClusterPeer(
    initialClusterpeer?.name,
    {
      initialData: { clusterpeer: initialClusterpeer },
    }
  );

  const updateResources = async (
    name: string,
    values: UpdateIPFSClusterPeer
  ) => {
    const clusterPeer = await updateClusterPeer(name, values);
    void mutate({ clusterpeer: clusterPeer });
  };

  if (!clusterpeer || isFallback) return <LoadingIndicator />;

  const dataList = [
    { label: 'Protocol', value: 'IPFS' },
    { label: 'Chain', value: 'public-swarm' },
    { label: 'Client', value: 'ipfs-cluster-service' },
    {
      label: 'Consensus',
      value: getLabel(clusterpeer.consensus, consensusOptions),
    },
    { label: 'ID', value: clusterpeer.id || 'N/A' },
    { label: 'From', value: clusterpeer.privatekeySecretName || 'N/A' },
  ];

  return (
    <Layout>
      <Heading title={clusterpeer.name} />

      <div className="bg-white shadow rounded-lg mt-4">
        <Tabs tabs={tabTitles}>
          <Tab.Panel className="focus:outline-none">
            <ProtocolDetails dataList={dataList} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <Peers
              peerEndpoint={clusterpeer.peerEndpoint}
              trustedPeers={clusterpeer.trustedPeers || []}
              bootstrapPeers={clusterpeer.bootstrapPeers || []}
              name={clusterpeer.name}
            />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <Security clusterSecretName={clusterpeer.clusterSecretName} />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <Resources
              cpu={clusterpeer.cpu}
              cpuLimit={clusterpeer.cpuLimit}
              memory={clusterpeer.memory}
              memoryLimit={clusterpeer.memoryLimit}
              storage={clusterpeer.storage}
              name={clusterpeer.name}
              updateResources={updateResources}
            />
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <DeleteDeployment name={clusterpeer.name} />
          </Tab.Panel>
        </Tabs>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const peerName = context.params?.peerName as string;
  try {
    const { clusterpeer } = await fetcher<{ clusterpeer: IPFSClusterPeer }>(
      `/ipfs/clusterpeers/${peerName}`
    );

    return {
      props: { initialClusterpeer: clusterpeer },
      revalidate: 10,
    };
  } catch (e) {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default ClusterPeerDetailsPage;
