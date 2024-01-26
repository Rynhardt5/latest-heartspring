import Debug from "@/components/common/debug";
import { getServerAuthSession } from "@/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-screen items-center justify-center">
      {session?.user && <Debug data={session?.user} title="- User" />}
    </div>
  );
}

// {
//     "id": "prod_Oj1Xc9dqdFmSQK",
//     "object": "product",
//     "active": true,
//     "attributes": [],
//     "created": 1695966238,
//     "default_price": null,
//     "description": null,
//     "features": [],
//     "images": [],
//     "livemode": false,
//     "metadata": {},
//     "name": "Small Timber Water Stand",
//     "package_dimensions": null,
//     "shippable": null,
//     "statement_descriptor": null,
//     "tax_code": null,
//     "type": "service",
//     "unit_label": null,
//     "updated": 1695966238,
//     "url": null
//   },

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
