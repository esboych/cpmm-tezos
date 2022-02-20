type storage is int

type returnType is list(operation) * storage

//(*
function sendValue(const _param : address) : list (operation) is 
block { 
    // alice
    const receiverAddress: address = ("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" : address); 
    //const receiverAddress: address = _param;
    const receiver : contract(unit) = get_contract(receiverAddress);

    const _payoutOperation: operation = transaction(unit, 10tez, receiver);
    const operations : list (operation) = list [_payoutOperation]
 } with operations
//*)

(*
function getContractOpt(const _addr: address): contract (unit) is
block {
    //var dest : address := (addr : address);
    const dest : address = ("KT1Nsp3BmKks8sHqBXW1gyXoAYWB63R8Vpuh" : address);
    //var res : option (contract (unit)) := Tezos.get_contract_opt (dest);

    const res : contract (unit) =
      case (Tezos.get_contract_opt (dest) : option (contract (unit))) of
        Some (contract) -> contract
      | None -> (failwith ("Contract not found.") : contract (unit))
      end;

} with res
*)

function main (const _param : address; const store : storage) : returnType is 
    block {
      const _result : list (operation) =  sendValue(_param);
      //skip;
    } with (_result, store) 
 

