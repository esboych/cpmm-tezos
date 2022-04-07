#include "fa12_types.ligo"

type storage is int

type returnType is list(operation) * storage

// wrap trnsfer FA1.2
function wrap_fa12_transfer_trx(
  const from_           : address;
  const to_             : address;
  const amt             : nat)
                        : fa12_transfer_t is
  FA12_transfer(from_, (to_, amt))

// get FA1.2 entrypoint
function get_fa12_token_transfer_entrypoint(
  const token           : address)
                        : contract(fa12_transfer_t) is
  case (Tezos.get_entrypoint_opt("%transfer", token) : option(contract(fa12_transfer_t))) of
  | Some(contr) -> contr
  | None        -> (failwith("err_fa12_transfer_entrypoint_404") : contract(fa12_transfer_t))
  end


// transfer FA1.2
function transfer_fa12(
  const from_           : address;
  const to_             : address;
  const amt             : nat;
  const token           : address)
                        : operation is
  Tezos.transaction(
    wrap_fa12_transfer_trx(from_, to_, amt),
    0mutez,
    get_fa12_token_transfer_entrypoint(token)
  )

[@view]
function getValue(const _param : int; const _store : storage) : int is _param

(* _param is an address of the FA12 token to exchange *)
function sendValue(const _param : address) : list (operation) is 
block { 
    // alice
    //const receiverAddress: address = ("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" : address);
    const receiverAddress: address = Tezos.sender;

    //simpleFA1.2
    //const tokenAddress : address =  ("KT18iQVMYDFCREW3vt28G5DZopnmJWDbdHpV" : address); 
    const tokenAddress : address = _param;

    //const receiverAddress: address = _param;
    //const receiver : contract(unit) = get_contract(receiverAddress);
    //transfer_token(Tezos.sender, Tezos.self_address, 10, "token_type");

    // get the transaction amount in tez
    const tez_amnt : tez = Tezos.amount;
    const fa12_amnt : nat = tez_amnt / 1tz * 2n;
    // and send back same amount in FA12 tokens
    const _payoutOperation: operation = transfer_fa12(Tezos.self_address,
     receiverAddress, fa12_amnt, tokenAddress);
    const operations : list (operation) = list [_payoutOperation]
 } with operations


function main (const _param : address; const store : storage) : returnType is 
    block {
      const _result : list (operation) =  sendValue(_param);
      //skip;
    } with (_result, store) 
 

