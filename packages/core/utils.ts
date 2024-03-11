import type { EntryPoint } from "permissionless/types/entrypoint"
import {
    type Address,
    type Hex,
    encodeFunctionData,
    erc20Abi,
    hexToSignature,
    isHex,
    signatureToHex,
    zeroAddress
} from "viem"
import { KERNEL_ADDRESSES } from "./accounts/index.js"
import type { ZeroDevPaymasterClient } from "./clients/paymasterClient.js"
import { KernelImplToVersionMap, LATEST_KERNEL_VERSION } from "./constants.js"
import { satisfies } from "semver"
import { getEntryPointVersion } from "permissionless";

export const getKernelVersion = <entryPoint extends EntryPoint>(entryPointAddress:entryPoint, kernelImpl?: Address): string => {
    const entryPointVersion = getEntryPointVersion(entryPointAddress)
    if (!kernelImpl || kernelImpl === zeroAddress) return  LATEST_KERNEL_VERSION[entryPointVersion]
    for (const [addr, ver] of Object.entries(KernelImplToVersionMap)) {
        if (addr.toLowerCase() === kernelImpl.toLowerCase()) return ver
    }
    return "0.2.1"
}

export enum KERNEL_FEATURES {
    ERC1271_SIG_WRAPPER = "ERC1271_SIG_WRAPPER",
    ERC1271_WITH_VALIDATOR = "ERC1271_WITH_VALIDATOR"
}

const KERNEL_FEATURES_BY_VERSION: Record<KERNEL_FEATURES, string> = {
    [KERNEL_FEATURES.ERC1271_SIG_WRAPPER]: ">=0.2.3", // || >=3.0.0-beta
    [KERNEL_FEATURES.ERC1271_WITH_VALIDATOR]: ">=3.0.0-beta"
}

export const hasKernelFeature = (
    feature: KERNEL_FEATURES,
    version: string
): boolean => {
    if (!(feature in KERNEL_FEATURES_BY_VERSION)) {
        return false
    }

    return satisfies(version, KERNEL_FEATURES_BY_VERSION[feature])
}

export const getERC20PaymasterApproveCall = async (
    client: ZeroDevPaymasterClient<EntryPoint>,
    {
        gasToken,
        approveAmount
    }: {
        gasToken: Address
        approveAmount: bigint
    }
): Promise<{ to: Address; value: bigint; data: Hex }> => {
    const response = await client.request({
        method: "zd_pm_accounts",
        params: [
            {
                chainId: client.chain?.id as number,
                entryPointAddress: KERNEL_ADDRESSES.ENTRYPOINT_V0_6
            }
        ]
    })
    return {
        to: gasToken,
        data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [response[0], approveAmount]
        }),
        value: 0n
    }
}

export const fixSignedData = (sig: Hex): Hex => {
    let signature = sig
    if (!isHex(signature)) {
        signature = `0x${signature}`
        if (!isHex(signature)) {
            throw new Error(`Invalid signed data ${sig}`)
        }
    }

    let { r, s, v } = hexToSignature(signature)
    if (v === 0n || v === 1n) v += 27n
    const joined = signatureToHex({ r, s, v })
    return joined
}
