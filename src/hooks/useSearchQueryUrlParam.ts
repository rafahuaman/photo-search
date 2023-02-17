import { useRouter } from "next/router";

export default function useSearchQueryUrlParam() {
  const router = useRouter();
  if (router.query.query === undefined) {
    return "";
  }
  return router.query.query as string;
}
