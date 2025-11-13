/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { NextRequest } from 'next/server'

import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = (req: NextRequest, args: { params: Promise<{ slug: string[] }> }) =>
  REST_GET(req, { config, params: args.params })

export const POST = (req: NextRequest, args: { params: Promise<{ slug: string[] }> }) =>
  REST_POST(req, { config, params: args.params })

export const DELETE = (req: NextRequest, args: { params: Promise<{ slug: string[] }> }) =>
  REST_DELETE(req, { config, params: args.params })

export const PATCH = (req: NextRequest, args: { params: Promise<{ slug: string[] }> }) =>
  REST_PATCH(req, { config, params: args.params })
